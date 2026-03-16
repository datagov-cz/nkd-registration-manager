import fileSystem from "node:fs/promises";

import {
  parseJsonLd,
  parseN3,
  createResourceCollector,
  createResourceReader,
  ResourceReader,
  ResourceDictionary,
} from "../rdf";

export async function loadIsdsMessage(
  filePath: string,
): Promise<RawIsdsMessage | null> {
  const content = await fileSystem.readFile(filePath, { encoding: "utf-8" });
  const collector = createResourceCollector();
  await parseN3(content, collector);
  const reader = createResourceReader(collector.result());
  return resourceRecordTsRawMessage(reader);
}

export interface RawIsdsMessage {

  messageIdentifier: string | null;

  annotation: string | null;

  senderDataBox: string | null;

  receivedAt: Date | null;

  fileName: string | null;

}

function resourceRecordTsRawMessage(
  reader: ResourceReader,
): RawIsdsMessage | null {
  const resource = reader.firstOfType(VOCABULARY.ReceivedRecord);
  if (resource === null) {
    // We ignore all other messages.
    return null;
  }
  return {
    messageIdentifier: resource.value(VOCABULARY.messageIdentifier),
    annotation: resource.value(VOCABULARY.annotation),
    senderDataBox: resource.value(VOCABULARY.senderMainBox),
    receivedAt: resource.date(VOCABULARY.receivedAt),
    fileName: resource.value(VOCABULARY.fileName),
  }
}

export async function loadIsdsAttachment(
  filePath: string,
): Promise<RawIsdsAttachment | null> {
  const content = await fileSystem.readFile(filePath, { encoding: "utf-8" });
  const json = JSON.parse(content);
  const collector = createResourceCollector();
  await parseJsonLd(json, collector);
  const reader = createResourceReader(collector.result());
  // Read dataset
  const dataset = reader.firstOfType(VOCABULARY.Dataset);
  if (dataset !== null) {
    const status = dataset.value(VOCABULARY.status);
    if (status === VOCABULARY.Withdrawn) {
      return {
        type: "withdraw-dataset",
        identifier: dataset.identifier().value,
        jsonld: json,
      } satisfies RawWithdrawDataset;
    }
    return {
      type: "create-dataset",
      identifier: dataset.identifier().value,
      data: collector.result(),
      jsonld: json,
    } satisfies RawCreateDataset;
  }
  // Read catalog
  const catalog = reader.firstOfType(VOCABULARY.Catalog);
  if (catalog !== null) {
    const status = catalog.value(VOCABULARY.status);
    if (status === VOCABULARY.Withdrawn) {
      return {
        type: "withdraw-catalog",
        identifier: catalog.value(VOCABULARY.endpointURL)!, // TODO : Must not be empty
        jsonld: json,
      } satisfies RawWithdrawCatalog;
    }
    return {
      type: "create-catalog",
      identifier: catalog.value(VOCABULARY.endpointURL)!, // TODO : Must not be empty
      data: collector.result(),
      jsonld: json,
    } satisfies RawCreateCatalog;
  }
  console.warn(`Unknown content for file "${filePath}".`);
  return null;
}

export type RawIsdsAttachment =
  RawCreateDataset |
  RawWithdrawDataset |
  RawCreateCatalog |
  RawWithdrawCatalog;

interface RawCreateDataset {

  type: "create-dataset";

  identifier: string;

  data: ResourceDictionary;

  jsonld: any;

}

interface RawWithdrawDataset {

  type: "withdraw-dataset";

  identifier: string;

  jsonld: any;

}

interface RawCreateCatalog {

  type: "create-catalog";

  identifier: string;

  data: ResourceDictionary;

  jsonld: any;

}

interface RawWithdrawCatalog {

  type: "withdraw-catalog";

  identifier: string;

  jsonld: any;

}

const VOCABULARY = {
  "ReceivedRecord": "https://data.gov.cz/slovník/nkod/PřijatýZáznam",
  "messageIdentifier": "https://data.gov.cz/slovník/nkod/id-datové-zprávy",
  "annotation": "https://data.gov.cz/slovník/nkod/anotace",
  "senderMainBox": "https://data.gov.cz/slovník/nkod/datová-schránka-poskytovatele",
  "receivedAt": "https://data.gov.cz/slovník/nkod/datová-zpráva-přijata",
  "fileName": "https://data.gov.cz/slovník/nkod/jméno-souboru",
  "Dataset": "http://www.w3.org/ns/dcat#Dataset",
  "status": "http://www.w3.org/ns/adms#status",
  "Catalog": "http://www.w3.org/ns/dcat#Catalog",
  "Withdrawn": "http://purl.org/adms/status/Withdrawn",
  "endpointURL": "http://www.w3.org/ns/dcat#endpointURL",
};
