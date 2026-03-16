import { test, expect } from "vitest";
import { parseJsonLd, parseN3, createResourceCollector } from ".";
import { createResourceReader } from "./resource/resource-reader";


test("Read NKD message record.", async () => {

  const input = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix nkod: <https://data.gov.cz/slovník/nkod/> .
@prefix ds: <https://data.gov.cz/zdroj/datové-schránky/> .

<https://data.gov.cz/přijaté-záznamy/663>
  a nkod:PřijatýZáznam ;
    nkod:id-datové-zprávy "663" ;
    nkod:anotace "NKD - testování 2" ;
    nkod:datová-schránka-poskytovatele ds:6bnaawp ;
    nkod:datová-zpráva-přijata "2019-04-01T12:05:53.305+02:00"^^xsd:dateTime ;
    nkod:jméno-souboru "663-nkod-registrace.jsonld (1).txt" ;
.
`;

  //

  const collector = createResourceCollector();
  await parseN3(input, collector);
  const reader = createResourceReader(collector.result());

  //

  const record = reader.firstOfType(
    "https://data.gov.cz/slovník/nkod/PřijatýZáznam");
  expect(record).not.toBeNull();

  expect(record?.identifier().value)
    .toBe("https://data.gov.cz/přijaté-záznamy/663");
  expect(record?.value("https://data.gov.cz/slovník/nkod/jméno-souboru"))
    .toBe("663-nkod-registrace.jsonld (1).txt");
  expect(record?.date("https://data.gov.cz/slovník/nkod/datová-zpráva-přijata"))
    .toStrictEqual(new Date("2019-04-01T12:05:53.305+02:00"));
});
