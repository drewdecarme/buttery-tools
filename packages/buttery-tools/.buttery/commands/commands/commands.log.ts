import { ButteryLogger } from "@buttery/logger";

export const LOG_COMMANDS = new ButteryLogger({
  id: "buttery-commands",
  prefix: "buttery:commands",
  prefixBgColor: "#e3d01c",
  logLevel: "debug",
});
