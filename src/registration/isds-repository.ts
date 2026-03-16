import fileSystem from "node:fs/promises";
import {
  loadIsdsAttachment,
  loadIsdsMessage,
  RawIsdsAttachment,
} from "./isds-reader";
import { logger } from "../application/";
import { createRppService, RppService } from "./rpp";

export function createIsdsRepository(
  messagesPath: string,
  attachmentsPath: string,
  rppSparqlEndpoint: string,
): IsdsRepository {
  return new DefaultIsdsRepository(
    messagesPath, attachmentsPath, rppSparqlEndpoint);
}

export interface IsdsRepository {

  /**
   * Run synchronization.
   */
  synchronize(): Promise<void>;

  /**
   * Return all messages for given organization.
   */
  listMessages(organization: string): IsdsMessage[];

}

export interface IsdsMessage {

  type: IsdsMessageType;

  databox: string;

  messageIdentifier: string;

  messageLabel: string | null;

  receivedAt: Date | null;

  iri: string | null;

  /**
   * Not every databox is mapped to an organization.
   */
  organization: string | null;

  /**
   * Content of an attachment file as JSON-LD.
   */
  attachment: string;

}

export enum IsdsMessageType {
  CreateDataset = "create-dataset",
  WithdrawDataset = "withdraw-dataset",
  CreateCatalog = "create-catalog",
  WithdrawCatalog = "withdraw-catalog",
}

class DefaultIsdsRepository implements IsdsRepository {

  readonly messages: IsdsMessage[] = [];

  readonly messagesPath: string;

  readonly attachmentsPath: string;

  readonly rppService: RppService;

  constructor(
    messagesPath: string,
    attachmentsPath: string,
    rppSparqlEndpoint: string,
  ) {
    this.messagesPath = messagesPath;
    this.attachmentsPath = attachmentsPath;
    this.rppService = createRppService(rppSparqlEndpoint);
  }

  async synchronize(): Promise<void> {
    const files = await fileSystem.readdir(this.messagesPath);
    for (const relativePath of files) {
      try {
        await this.loadMessage(relativePath);
      } catch (error) {
        logger.warn({ message: relativePath, error },
          "Ignored message file.");
      }
    }
  }

  private async loadMessage(relativePath: string): Promise<void> {
    // Load message.
    const messagePath = `${this.messagesPath}/${relativePath}`;
    const message = await loadIsdsMessage(messagePath);
    // Validate message.
    if (message === null ||
      message.senderDataBox === null ||
      message.messageIdentifier === null ||
      message.fileName === null
    ) {
      logger.warn({ message: relativePath },
        "Ignored invalid message file.");
      return;
    }
    // Load attachment.
    const attachmentPath = `${this.attachmentsPath}/${message.fileName}`;
    const attachment = await loadIsdsAttachment(attachmentPath);
    // Validate attachment.
    if (attachment === null) {
      logger.warn({ message: relativePath },
        "Ignored message file for invalid attachment file.");
      return;
    }
    // Get organization - we need to change from IRI to databox identifier.
    const databox = message.senderDataBox.substring(
      message.senderDataBox.lastIndexOf("/") + 1);
    const organization = await this.rppService.databoxToOrganization(databox);


    // Store the message.
    this.messages.push({
      type: asIsdsMessageType(attachment),
      databox: message.senderDataBox,
      messageIdentifier: message.messageIdentifier,
      messageLabel: message.annotation,
      receivedAt: message.receivedAt,
      iri: attachment.identifier,
      organization,
      attachment: attachment.jsonld,
    });
  }

  listMessages(organization: string): IsdsMessage[] {
    return this.messages.filter(item => item.organization === organization);
  }

}

function asIsdsMessageType(
  attachment: RawIsdsAttachment,
): IsdsMessageType {
  switch (attachment.type) {
    case "create-catalog":
      return IsdsMessageType.CreateCatalog;
    case "create-dataset":
      return IsdsMessageType.CreateDataset;
    case "withdraw-catalog":
      return IsdsMessageType.WithdrawCatalog;
    case "withdraw-dataset":
      return IsdsMessageType.WithdrawDataset;
  }
}

//
// RUN MAIN TEST
//

(async () => {
  console.log("Creating repository ...")
  const repository = createIsdsRepository(
    "./data/adapter/messages",
    "./data/adapter/attachments",
    "https://rpp-opendata.egon.gov.cz/odrpp/sparql",
  );
  console.log("Loading messages ...")
  await repository.synchronize();
  for (const message of (repository as any).messages) {
    const typed = message as IsdsMessage;
    console.log(typed);
  }
});
