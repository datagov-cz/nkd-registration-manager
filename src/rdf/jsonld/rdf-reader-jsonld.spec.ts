import { describe, it, expect } from "vitest";
import { createJsonLdReader } from "./rdf-reader-jsonld";

describe("RdfJsonLdReader", () => {

  it("Empty array.", () => {
    const reader = createJsonLdReader([]);
    //
    const entities = reader.entities();
    expect(entities.length).toBe(0);
  });

  it("Object.", () => {
    const reader = createJsonLdReader({});
    //
    const entities = reader.entities();
    expect(entities.length).toBe(1);
  });

  it("Reading arrays.", () => {
    const document = {
      "http://www.w3.org/ns/dcat#theme": [
        { "@id": "http://publications.europa.eu/authority/data-theme/TRAN" },
        { "@id": "http://eurovoc.europa.eu/4515" },
        { "@id": "http://eurovoc.europa.eu/4735" },
        { "@id": "http://eurovoc.europa.eu/4736" },
        { "@id": "http://eurovoc.europa.eu/4359" }
      ],
      "http://purl.org/dc/terms/title": [
        { "@language": "cs", "@value": "Voda" },
        { "@language": "en", "@value": "Water" }
      ],
      "http://www.w3.org/ns/dcat#keyword": [
        { "@language": "cs", "@value": "vnitrozemská vodní doprava" },
        { "@language": "cs", "@value": "RIS" },
      ]
    };
    const reader = createJsonLdReader([]);
    //
    const entity = reader.entities()[0]!;

  });

  it("Array of entities.", () => {
    const document = [{
      "@id": "http://localhost/1",
      "http://localhost/single": { "@id": "http://localhost/3" },
      "http://localhost/array": [{ "@id": "http://localhost/2", }],
    }, {
      "@id": "http://localhost/2",
      "http://purl.org/dc/terms/title": "Second",
    }, {
      "@id": "http://localhost/3",
      "http://purl.org/dc/terms/title": "Third",
    }];
    const reader = createJsonLdReader([]);
    //
    const entity = reader.iri("http://localhost/1")!;
  });

  it("NDC: Catalogs", () => {
    const document = [
      {
        "@id": "https://data.gov.cz/zdroj/lokální-katalogy/70890692/1571880810",
        "@type": "https://data.gov.cz/slovník/nkod/DcatApLkod",
        "http://purl.org/dc/terms/publisher": {
          "@id": "https://rpp-opendata.egon.gov.cz/odrpp/70890692",
        },
        "http://purl.org/dc/terms/title": [
          {
            "@value": "Katalog otevřených dat MSK",
            "@language": "cs"
          }
        ],
        "http://www.w3.org/ns/dcat#contactPoint": {
          "http://xmlns.com/foaf/0.1/email": "mailto:gis@msk.cz",
          "http://xmlns.com/foaf/0.1/name": {
            "@value": "Vojtěch Wala",
            "@language": "cs"
          }
        },
        "http://xmlns.com/foaf/0.1/homepage": [{ "@id": "https://data.msk.cz/" }],
        "http://www.w3.org/ns/dcat#endpointURL": { "@id": "https://lkod.msk.cz/nkod/index" }
      }, {
        "@id": "https://data.gov.cz/zdroj/lokální-katalogy/00007064/706529437",
        "@type": "https://data.gov.cz/slovník/nkod/DcatApSparql",
      },];
    const reader = createJsonLdReader(document);
    // Find a catalog to work with.
    const catalogs = reader.anyOfType([
      "https://data.gov.cz/slovník/nkod/DcatApLkod",
      "https://data.gov.cz/slovník/nkod/DcatApSparql",
    ]);
    expect(catalogs.length).toBe(2);
    const catalog = catalogs[0];
    // Read publisher.
    const publisher = catalog
      .firstIri("http://purl.org/dc/terms/publisher");
    expect(publisher).toBe("https://rpp-opendata.egon.gov.cz/odrpp/70890692");
    // Read homepage.
    const homepage = catalog
      .firstIri("http://xmlns.com/foaf/0.1/homepage");
    expect(homepage).toBe("https://data.msk.cz/");
    // Read title.
    const title = catalog
      .languageString("http://purl.org/dc/terms/title");
    expect(title).toStrictEqual({
      "cs": "Katalog otevřených dat MSK"
    });
    // React contact point.
    const contactPoint = catalog
      .firstEntity("http://www.w3.org/ns/dcat#contactPoint")!;
    const email = contactPoint.
      firstAsString("http://xmlns.com/foaf/0.1/email");
    expect(email).toBe("mailto:gis@msk.cz");
  });

});
