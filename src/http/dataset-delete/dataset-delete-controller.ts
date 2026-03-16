import { type FastifyReply, type FastifyRequest } from "fastify";
import { Forms } from "../../dcat-ap-forms";

export async function handleDatasetDeleteGet(
  forms: Forms, request: FastifyRequest, response: FastifyReply,
) {
  let payload = {
    "@type": "http://www.w3.org/ns/dcat#Dataset",
    "@id": "http://dataset-to-be-removed",
    "http://purl.org/dc/terms/title": { "@value": "Dataset name", "@lang": "cs" },
    "http://purl.org/dc/terms/description": { "@value": "Dataset description", "@lang": "cs" }
  };

  const html = await forms.fetchWithdrawDatasetHtml(payload);

  response
    .code(200)
    .type("text/html")
    .header("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval';")
    .send(html);
}
