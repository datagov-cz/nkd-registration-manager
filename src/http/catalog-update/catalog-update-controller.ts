import { type FastifyReply, type FastifyRequest } from "fastify";
import { Forms } from "../../dcat-ap-forms";

export async function handleCatalogUpdateGet(
  forms: Forms, request: FastifyRequest, response: FastifyReply,
) {
  let payload = {
    "@context": "https://ofn.gov.cz/dcat-ap-cz-rozhraní-katalogů-otevřených-dat/2024-05-28/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
    "@type": [
      "Katalog",
      "https://data.gov.cz/slovník/nkod/DcatApSparql"
    ],
    "přístupový_bod": "https://localhost/sparql",
    "název": {
      "cs": "Můj katalog", "en": "My catalog"
    },
    "kontaktní_bod": {
      "typ": "Organizace",
      "jméno": { "cs": "Petr" },
      "e-mail": "mailto:petr@example.cz"
    },
    "domovská_stránka": "https://localhost/homepage"
  };

  const html = await forms.fetchRegisterCatalogHtml(payload);

  response
    .code(200)
    .type("text/html")
    .header("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval';")
    .send(html);
}
