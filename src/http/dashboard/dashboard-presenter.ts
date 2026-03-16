import { type FastifyReply, type FastifyRequest } from "fastify";
import { renderDashboardViewHtml } from "./dashboard-view-html";
import { type DashboardState } from "./dashboard-model";
import { IsdsRepository } from "../../registration/isds-repository";

export function handleDashboardGet(
  repository: IsdsRepository,
  request: FastifyRequest,
  response: FastifyReply,
) {
  const user = request.user;
  const messages = repository.listMessages(user.entity.identifier);

  // Create state ...
  const state: DashboardState = {
    user: {
      name: `${user.familyName} ${user.givenName}`,
      logout: "/caais/logout?redirect-url=/"
    },
    organization: {
      name: user.entity.name,
    },
    catalogs: [],
    catalogCreateUrl: null,
    datasets: [],
    datasetCreateUrl: null,
    messages: messages.map(message => ({
      identifier: message.messageIdentifier,
      label: message.messageLabel ?? "",
      type: String(message.type),
      iri: message.iri,
      payload: message.attachment,
    })),
  }

  response
    .code(200)
    .type("text/html")
    // .header("Content-Security-Policy", "script-src 'self' https://data.gov.cz/;")
    .send(renderDashboardViewHtml(state));
}
