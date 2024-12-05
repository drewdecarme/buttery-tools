import { build as buildIcons } from "@buttery/icons/cli/build";
import { build as buildTokens } from "@buttery/tokens/cli/build";

import { LOG } from "../src/build/utils";

try {
  // build the scripts
  await buildIcons({ prompt: false, logLevel: "debug" });
  await buildTokens();
} catch (error) {
  throw LOG.fatal(
    new Error(
      `Error when building the @buttery/docs for distribution: ${error}`
    )
  );
}
