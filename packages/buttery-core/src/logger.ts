import { ButteryLogger } from "@buttery/logger";

export const LOG = new ButteryLogger({
  prefix: "@buttery/core",
  format: "basic",
  logLevel: "debug",
  shouldPrintLevel: false,
});
