import { configuration } from "./application/configuration";
import { createForms } from "./dcat-ap-forms";
import { createHttpServer, registerRoutes, startServer } from "./http";
import { createHttpAuthentication } from "./http/http-authentication";
import { createIsdsRepository } from "./registration/isds-repository";

(async function main(configuration) {
  const authentication = createHttpAuthentication();
  const forms = createForms(configuration);
  const httpServer = await createHttpServer(configuration, authentication);
  const repository = createIsdsRepository(
    configuration.isds.messagesPath,
    configuration.isds.attachmentsPath,
    configuration.rpp.sparql,
  );

  registerRoutes(httpServer, forms, repository);

  await repository.synchronize();

  startServer(configuration, httpServer);
})(configuration);
