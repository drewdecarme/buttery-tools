import { ButteryLogger } from "@buttery/logger";

export const LOG_DOCS = new ButteryLogger({
  prefix: "@buttery/docs",
  shouldPrintLevel: false,
  format: "basic"
});
