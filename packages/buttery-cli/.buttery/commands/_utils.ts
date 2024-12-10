import { ButteryLogger } from "../../../buttery-logs/dist/ButteryLogger";

export const LOG_CLI = new ButteryLogger({
  id: "buttery:cli",
  prefix: "buttery:cli",
  prefixBgColor: "#e7d860",
  logLevel: "error",
});
