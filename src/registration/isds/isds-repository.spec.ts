import { describe, expect, it } from "vitest";
import { mockFileSystemService } from "../../file-system";
import { createIsdsRepository } from "./isds-repository";
import { RppService } from "../../rpp";

describe("createIsdsRepository", () => {

  const rppService: RppService = {
    databoxToOrganization(databox) {
      if (databox === "yukd8p7") {
        return Promise.resolve("17651921");
      }
      throw new Error(`Unexpected databox "${databox}".`);
    },
  };

  it("Implementation test I.", async () => {
    const fileSystem = mockFileSystemService({
      "/messages/register-dataset-1000307675.ttl": `
@prefix nkod: <https://data.gov.cz/slovník/nkod/> .
@prefix ds: <https://data.gov.cz/zdroj/datové-schránky/> .

<https://data.gov.cz/zdroj/nkod/přijaté-záznamy/1000307675> a nkod:PřijatýZáznam;
  nkod:id-datové-zprávy "1000307675";
  nkod:anotace "NKOD";
  nkod:datová-schránka-poskytovatele ds:yukd8p7;
  nkod:datová-zpráva-přijata "2022-02-08T11:33:55.810+01:00"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
  nkod:jméno-souboru "1000307675-nkod-registrace.jsonld.txt" .
      `,
      "/messages/register-dataset-1583728328.ttl": `
@prefix nkod: <https://data.gov.cz/slovník/nkod/> .
@prefix ds: <https://data.gov.cz/zdroj/datové-schránky/> .

<https://data.gov.cz/zdroj/nkod/přijaté-záznamy/1583728328> a nkod:PřijatýZáznam;
  nkod:id-datové-zprávy "1583728328";
  nkod:anotace "NKOD";
  nkod:datová-schránka-poskytovatele ds:yukd8p7;
  nkod:datová-zpráva-přijata "2022-02-08T11:33:55.810+01:00"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
  nkod:jméno-souboru "1583728328-nkod-registrace.jsonld_0.txt" .
      `,
      "/attachments/1000307675-nkod-registrace.jsonld.txt": `{
  "@id": "https://data.gov.cz/zdroj/datové-sady/DIA/247025600",
  "@type": [
    "http://www.w3.org/ns/dcat#Dataset",
    "https://data.gov.cz/slovník/nkod/typ-datové-sady-dle-zdroje/Formulář"
  ],
  "http://purl.org/dc/terms/title": {
    "@language": "cs",
    "@value": "Přístupy k agendám CzechPOINT - 2007"
  }
}
      `,
      "/attachments/1583728328-nkod-registrace.jsonld_0.txt": `{
  "@context": "https://ofn.gov.cz/dcat-ap-cz-rozhraní-katalogů-otevřených-dat/2024-05-28/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  "iri": "_:ds",
  "typ": "Datová sada",
  "název": {
    "cs": "Registr silničních vozidel - technické údaje",
    "en": "Road Vehicle Register - Vehicle Technical Specifications"
  }
}
      `
    });

    const repository = createIsdsRepository(
      fileSystem, rppService, "/messages", "/attachments");

    await repository.synchronize();

    const registrations = repository.listRegistrations("17651921")

    expect(registrations).toStrictEqual([
      {
        type: "create-dataset",
        source: "isds",
        createdAt: new Date("2022-02-08T10:33:55.810Z"),
        identifier: "isds-1000307675",
        organization: "17651921",
        attachmentPath: "/attachments/1000307675-nkod-registrace.jsonld.txt",
        label: { cs: "Přístupy k agendám CzechPOINT - 2007" }
      },
      {
        type: "create-dataset",
        source: "isds",
        createdAt: new Date("2022-02-08T10:33:55.810Z"),
        identifier: "isds-1583728328",
        organization: "17651921",
        attachmentPath: "/attachments/1583728328-nkod-registrace.jsonld_0.txt",
        label: {
          cs: "Registr silničních vozidel - technické údaje",
          en: "Road Vehicle Register - Vehicle Technical Specifications"
        }
      },
    ]);

  });

});
