import { ButteryLogger } from "@buttery/logger";

const basicLogger = new ButteryLogger({
  prefix: "buttery-tokens",
  logLevel: "info"
});

basicLogger.debug("this is an debug message");
basicLogger.debug(
  "this is an trace message",
  { test: "test" },
  { other: "string" }
);
basicLogger.success("Successful!");
basicLogger.warning("this is a warning");
basicLogger.fatal(new Error("Something went horribly wrong."));
