// https://github.com/pinojs/pino
import pino from "pino";
import { type LoggerOptions } from "pino";

import { configuration } from "./configuration";

const pinoConfiguration: LoggerOptions = {};

if (configuration.development) {
  // Add pretty print for development.
  pinoConfiguration["transport"] = {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  };
}

export const logger = pino(pinoConfiguration);
