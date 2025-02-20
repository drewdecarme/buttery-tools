import { tryHandle } from "@buttery/utils/isomorphic";

import { tokenStudio } from "../src/cli-scripts/token-studio.js";
import { LOG } from "../src/utils/util.logger.js";

const res = await tryHandle(tokenStudio)({ logLevel: "debug", prompt: true });
if (res.hasError) {
  LOG.fatal(res.error);
}
