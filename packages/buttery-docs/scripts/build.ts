import { build as buildClIScripts } from "@buttery/core/builder";
import { build as buildIcons } from "@buttery/icons/cli/build";
import { build as buildTokens } from "@buttery/tokens/cli/build";

import { LOG } from "../src/utils";

try {
  // build the scripts
  await buildClIScripts({ mode: "cli-scripts" });
  await buildIcons();
  await buildTokens();
} catch (error) {
  throw LOG.fatal(
    new Error(
      `Error when building the @buttery/docs for distribution: ${error}`
    )
  );
}
