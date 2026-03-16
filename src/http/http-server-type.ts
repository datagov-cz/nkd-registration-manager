/**
 * This file contains declaration of fastify types used in this application.
 */
import type { IncomingMessage, Server, ServerResponse } from "node:http";

import {
  type FastifyInstance,
  type FastifyTypeProviderDefault,
} from "fastify";
import { Logger } from "pino";

/**
 * Declaration of a custom session type.
 */
declare module "fastify" {
  interface Session {
    /**
     * True when user has been authenticated.
     */
    authenticated: boolean;
    /**
     * Used by CAAIS for authentication.
     */
    nonce: string | undefined;
  }
}

/**
 * Export server type here so we can include it in other files
 * without introducing a cycle.
 */
export type HttpServer = FastifyInstance<
  Server<typeof IncomingMessage, typeof ServerResponse>,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  Logger,
  FastifyTypeProviderDefault>;
