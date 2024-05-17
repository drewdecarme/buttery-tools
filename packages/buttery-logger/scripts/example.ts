import { ButteryLogger } from "@buttery/logger";

const basicLogger = new ButteryLogger({
  prefix: "example",
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
basicLogger.error("this is an error");
basicLogger.info(
  "Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla. Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum."
);
basicLogger.fatal(new Error("Something went horribly wrong."));
