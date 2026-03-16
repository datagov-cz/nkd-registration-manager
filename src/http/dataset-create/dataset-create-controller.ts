import { type FastifyReply, type FastifyRequest } from "fastify";
import { Forms } from "../../dcat-ap-forms";

export async function handleDatasetCreateGet(
  forms: Forms, request: FastifyRequest, response: FastifyReply,
) {
  let payload = {
    "@context": "https://ofn.gov.cz/dcat-ap-cz-rozhraní-katalogů-otevřených-dat/2024-05-28/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
    "iri": "https://localhost/my-dataset",
    "typ": "Datová sada",
    "název": {
      "cs": "Dataová sada",
      "en": "My dataset"
    },
    "popis": {
      "cs": "Popis",
      "en": "Description"
    },
    "prvek_rúian": [
      "https://linked.cuzk.cz/resource/ruian/stat/1"
    ],
    "geografické_území": [],
    "prostorové_pokrytí": [],
    "klíčové_slovo": {
      "cs": [
        "klíč",
        "hodnota"
      ],
      "en": [
        "key",
        "value"
      ]
    },
    "periodicita_aktualizace": "http://publications.europa.eu/resource/authority/frequency/MONTHLY",
    "téma": [
      "http://publications.europa.eu/resource/authority/data-theme/AGRI"
    ],
    "koncept_euroVoc": [],
    "kontaktní_bod": {},
    "poskytovatel": "https://localhost/publisher/",
    "distribuce": [
      {
        "typ": "Distribuce",
        "název": {
          "cs": "Výchozí"
        },
        "podmínky_užití": {
          "typ": "Specifikace podmínek užití",
          "autorské_dílo": "https://data.gov.cz/podmínky-užití/neobsahuje-autorská-díla/",
          "databáze_jako_autorské_dílo": "https://data.gov.cz/podmínky-užití/není-autorskoprávně-chráněnou-databází/",
          "databáze_chráněná_zvláštními_právy": "https://data.gov.cz/podmínky-užití/není-chráněna-zvláštním-právem-pořizovatele-databáze/",
          "osobní_údaje": "https://data.gov.cz/podmínky-užití/neobsahuje-osobní-údaje/"
        },
        "přístupové_url": "https://localhost/dist/endpoint",
        "přístupová_služba": {
          "typ": "Datová služba",
          "přístupový_bod": "https://localhost/dist/endpoint",
          "popis_přístupového_bodu": "https://localhost/dist/desc",
          "název": {
            "cs": "Výchozí"
          },
          "poskytuje_datovou_sadu": "_:ds"
        }
      }
    ]
  };

  const html = await forms.fetchRegisterDatasetHtml(payload);

  response
    .code(200)
    .type("text/html")
    .header("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval';")
    .send(html);
}
