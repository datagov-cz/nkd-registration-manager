import { type FastifyReply, type FastifyRequest } from "fastify";
import { Forms } from "../../dcat-ap-forms";

export async function handleCatalogDeleteGet(
  forms: Forms, request: FastifyRequest, response: FastifyReply,
) {
  let payload = {
    "@type": "http://www.w3.org/ns/dcat#Catalog",
    "@id": "http://catalog-to-be-removed",
    "http://purl.org/dc/terms/title": { "@value": "My Custom catalog ...", "@lang": "cs" },
    "http://purl.org/dc/terms/description": { "@value": "Catalog description", "@lang": "cs" }
  };

  const html = await forms.fetchWithdrawCatalogHtml(payload);

  response
    .code(200)
    .type("text/html")
    .header("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval';")
    .send(html);
}
