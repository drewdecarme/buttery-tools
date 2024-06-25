import { LOG } from "../.buttery/commands/_utils/util.logger.js";
import { buildLocalCLI } from "./build-local.build-cli.js";
import { buildDistributionLibrary } from "./build-local.build-library.js";

try {
  await Promise.all([buildLocalCLI(), buildDistributionLibrary()]);
} catch (error) {
  throw LOG.fatal(new Error(error as string));
}
