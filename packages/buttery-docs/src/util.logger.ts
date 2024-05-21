import { ButteryLogger } from "@buttery/logger";

export const LOG = new ButteryLogger({
  prefix: "@buttery/docs",
  logLevel: "debug",
  shouldPrintLevel: false,
  format: "basic"
});
