import { ButteryLogger } from "@buttery/core/logger";

export const LOG_SERVER = new ButteryLogger({
  id: "buttery-docs",
  prefix: "buttery:docs:server",
  prefixBgColor: "#812c8d",
  logLevel: "debug",
});
