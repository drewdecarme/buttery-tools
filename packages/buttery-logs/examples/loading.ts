import { ButteryLogger } from "../src/ButteryLogger.js";

const LOG = new ButteryLogger({
  id: "loading",
  prefix: "example:loading",
  prefixBgColor: "#fff",
  logLevel: "info",
});

LOG.loadingStart("Loading");
LOG.debug("doing some stuff...");
LOG.debug("doing some stuff...");
LOG.debug("doing some stuff...");
LOG.debug("doing some stuff...");
LOG.debug("doing some stuff...");
LOG.debug("doing some stuff...");
LOG.debug("doing some stuff...");
LOG.debug("doing some stuff...");
setTimeout(() => LOG.loadingEnd("Done!"), 5_000);
