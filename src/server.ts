import { configuration } from "./application/configuration";
import { createForms } from "./dcat-ap-forms";
import { createFileSystemService } from "./file-system";
import { createHttpServer, registerRoutes, startServer } from "./http";
import { createHttpAuthentication } from "./http/http-authentication";
import { createRegistrationRepository } from "./registration";
import { createDiskRepository } from "./registration/disk";
import { createIsdsRepository } from "./registration/isds/isds-repository";
import { createRppService } from "./rpp";
import { createSparqlService } from "./sparql";

(async function main(configuration) {
  const authentication = createHttpAuthentication();
  const forms = createForms(configuration);
  const httpServer = await createHttpServer(configuration, authentication);

  const sparql = createSparqlService();
  const fileSystem = createFileSystemService();
  const rpp = createRppService(sparql, configuration.rpp.sparql);

  const isdsRepository = createIsdsRepository(
    fileSystem, rpp,
    configuration.isds.messagesPath,
    configuration.isds.attachmentsPath,
  );

  const diskRepository = createDiskRepository(
    fileSystem,
    configuration.repository.messagesPath,
    configuration.repository.attachmentsPath,
  )

  const repository = createRegistrationRepository(
    isdsRepository, diskRepository);

  registerRoutes(httpServer, forms, repository);

  await repository.synchronize();

  startServer(configuration, httpServer);
})(configuration);
