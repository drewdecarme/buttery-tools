import { ButteryLogger } from "@buttery/logger";

export const LOG_DOCS = new ButteryLogger({
  prefix: "@buttery/docs",
  logLevel: "info",
  shouldPrintLevel: false,
});
