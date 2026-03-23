import { type FastifyReply, type FastifyRequest } from "fastify";
import { renderDashboardViewHtml } from "./dashboard-view-html";
import { type DashboardState } from "./dashboard-model";
import { RegistrationRepository } from "../../registration";

export function handleDashboardGet(
  repository: RegistrationRepository,
  request: FastifyRequest,
  response: FastifyReply,
) {
  const user = request.user;
  const messages = repository.listRegistrations(user.entity.identifier);

  // Create state ...
  const state: DashboardState = {
    user: {
      name: `${user.familyName} ${user.givenName}`,
      logout: "/caais/logout?redirect-url=/"
    },
    organization: {
      name: user.entity.name,
    },
    messages: messages.map(message => ({
      identifier: message.identifier,
      label: message.label["cs"],
      type: message.type,
      createdAt: message.createdAt,
    })),
  }

  response
    .code(200)
    .type("text/html")
    // .header("Content-Security-Policy", "script-src 'self' https://data.gov.cz/;")
    .send(renderDashboardViewHtml(state));
}

export async function handleDashboardPost(
  repository: RegistrationRepository,
  request: FastifyRequest,
  response: FastifyReply,
) {
  const user = request.user;

  //

  const file = await request.file();
  if (file === undefined) {
    response.code(400).send();
    return;
  }
  const buffer: Buffer<ArrayBufferLike> = await file.toBuffer();
  const attachment = buffer.toString("utf-8");

  await repository.createRegistration(
    user.entity.identifier, user.login, attachment);

  response
    .redirect("/");
}
