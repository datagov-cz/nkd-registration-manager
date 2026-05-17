import { describe, expect, it } from "vitest";
import { parseIsdsAttachment } from "./isds-attachment";

describe("parseIsdsAttachment", () => {
  it("Parse delete record.", async () => {
    const content = `{
  "@context": "https://ofn.gov.cz/dcat-ap-cz-rozhraní-katalogů-otevřených-dat/2024-05-28/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  "typ": "Katalog",
  "iri": "https://data.gov.cz/zdroj/lokální-katalogy/70890692/01-ee06-aa20-31c0",
  "http://www.w3.org/ns/adms#status": {
    "@id": "http://purl.org/adms/status/Withdrawn"
  }
}`;
    const attachment = await parseIsdsAttachment(content);
    expect(attachment).not.toBeNull();
  });
});
