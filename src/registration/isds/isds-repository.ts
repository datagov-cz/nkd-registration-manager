import { RppService } from "../../rpp";
import { FileSystemService } from "../../file-system";
import { logger } from "../../application";
import { LanguageString } from "../../rdf";
import { RegistrationEntry, RegistrationSourceType } from "../registration-model";
import { parseIsdsAttachment } from "./isds-attachment";
import { parseIsdsMessage } from "./isds-message";

export function createIsdsRepository(
  fileSystem: FileSystemService,
  rppService: RppService,
  messagesPath: string,
  attachmentsPath: string,
): IsdsRepository {
  return new DefaultIsdsRepository(
    fileSystem, rppService, messagesPath, attachmentsPath);
}

export interface IsdsRepository {

  /**
   * @returns All entries for given organization.
   */
  listRegistrations(organization: string): RegistrationEntry[];

  /**
   * @returns Content of given message's attachment or null.
   */
  readAttachment(
    organization: string,
    identifier: string,
  ): Promise<string | null>;

  /**
   * Run synchronize content with storage.
   */
  synchronize(): Promise<void>;

}

/**
 * TODO : We need to introduce an index file to not load all messages every time.
 */
class DefaultIsdsRepository implements IsdsRepository {

  readonly messages: RegistrationEntry[] = [];

  readonly fileSystem: FileSystemService;

  readonly rppService: RppService;

  readonly messagesPath: string;

  readonly attachmentsPath: string;

  constructor(
    fileSystem: FileSystemService,
    rppService: RppService,
    messagesPath: string,
    attachmentsPath: string,
  ) {
    this.fileSystem = fileSystem;
    this.rppService = rppService;
    this.messagesPath = messagesPath;
    this.attachmentsPath = attachmentsPath;
  }

  listRegistrations(organization: string): RegistrationEntry[] {
    return this.messages.filter(item => item.organization === organization);
  }

  async readAttachment(
    organization: string,
    identifier: string,
  ): Promise<string | null> {
    const entry = this.messages.find(item =>
      item.organization === organization && item.identifier === identifier);
    if (entry === undefined) {
      return null;
    }
    return await this.fileSystem.readFile(entry.attachmentPath);
  }

  async synchronize(): Promise<void> {
    const files = await this.fileSystem.readDirectory(this.messagesPath);
    for (const messagePath of files) {
      try {
        const message = await this.loadMessage(messagePath);
        // This can be slow once there are many messages.
        const index = this.messages.findIndex(
          item => item.identifier === message.identifier);
        if (index === -1) {
          this.messages.push(message);
        } else {
          this.messages[index] = message;
        }
      } catch (error) {
        logger.warn(
          { message: messagePath, error: (error as Error).message},
          "Failed to process a message.");
      }
    }
  }

  private async loadMessage(messagePath: string): Promise<RegistrationEntry> {
    // Read message.
    const messageContent = await this.fileSystem.readFile(messagePath);
    const message = await parseIsdsMessage(messageContent);
    // Validate message.
    if (message === null ||
      message.senderDataBox === null ||
      message.messageIdentifier === null ||
      message.attachmentFileName === null
    ) {
      throw new Error("ISDS Message is not valid.");
    }
    // Read attachment.
    const attachmentPath =
      `${this.attachmentsPath}/${message.attachmentFileName}`;
    const attachmentContent = await this.fileSystem.readFile(attachmentPath);
    const attachment = await parseIsdsAttachment(attachmentContent);
    // Validate attachment.
    if (attachment === null) {
      throw new Error("ISDS Attachment is not valid.");
    }
    // Get organization - we need to change from IRI to databox identifier.
    const databox = message.senderDataBox.substring(
      message.senderDataBox.lastIndexOf("/") + 1);
    const organization = await this.rppService.databoxToOrganization(databox);
    if (organization === null) {
      throw new Error("Unknown databox identifier.");
    }
    // Prepare label.
    let label: LanguageString = {};
    if (attachment.label === null) {
      if (attachment.iri === null) {
        // We have nothing to show.
      } else {
        label = { "": attachment.iri };
      }
    } else {
      label = attachment.label;
    }
    //
    return {
      type: attachment.type,
      source: RegistrationSourceType.ISDS,
      createdAt: message.receivedAt,
      identifier: "isds-" + message.messageIdentifier,
      organization,
      attachmentPath,
      label,
    };
  }

}
