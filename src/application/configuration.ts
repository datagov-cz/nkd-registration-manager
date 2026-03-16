// Load values from .env file and put them into process.env.
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const ConfigurationSchema = z.object({
  /**
   * True when in a development mode.
   */
  development: z.boolean(),
  forms: z.object({
    /**
     * URL of the dcat-ap-forms service, see
     * https://github.com/datagov-cz/nkd-formulare .
     *
     * Must not end with '/'.
     */
    proxyUrl: z.url(),
  }),
  /**
   * Configuration of this service HTTP interface.
   */
  http: z.object({
    /**
     * Port for the HTTP server to listen on.
     */
    port: z.number().positive(),
    /**
     * IP address for the HTTP server.
     */
    host: z.ipv4(),
    /**
     * Name of cookie to send to the user.
     */
    cookieName: z.string(),
    /**
     * A secret with minimum length of 32 characters.
     * We use this to sign the cookies.
     */
    cookiesSecret: z.string(),
  }),
  isds: z.object({
    /**
     * Path to directory with ISDS messages.
     */
    messagesPath: z.string(),
    /**
     * Path to directory with ISDS attachments.
     */
    attachmentsPath: z.string(),
  }),
  storage: z.object({
    /**
     * Path to storage directory.
     */
    path: z.string(),
  }),
  rpp: z.object({
    /**
     * Path to RPP SPARQL endpoint.
     */
    sparql: z.string(),
  }),
});

export type Configuration = z.infer<typeof ConfigurationSchema>;

const createConfiguration = (): Configuration => {
  const env = process.env;
  return ConfigurationSchema.parse({
    development: env.NODE_ENV === "development",
    forms: {
      proxyUrl: "http://localhost:8057",
    },
    http: {
      port: Number(env.HTTP_PORT),
      host: env.HTTP_HOST,
      cookieName: "nkod-registration-manager",
      cookiesSecret: env.HTTP_COOKIE_SECRET,
    },
    isds: {
      messagesPath: resolvePath(env.ISDS_ATTACHMENTS),
      attachmentsPath: resolvePath(env.ISDS_MESSAGES),
    },
    storage: {
      path: resolvePath(env.STORAGE_PATH),
    },
    rpp: {
      sparql: "https://rpp-opendata.egon.gov.cz/odrpp/sparql",
    },
  });
};

function resolvePath(path: string | undefined): string | undefined {
  // We need to go from source directory.
  return path === undefined ? undefined : resolve(__dirname, "..", path);
}

export const configuration = createConfiguration();
