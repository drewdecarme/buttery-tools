import { tryHandle } from "@buttery/utils/isomorphic";

import { build } from "../src/cli-scripts/build.js";
import { LOG } from "../src/utils/util.logger.js";

const res = await tryHandle(build)({ logLevel: "debug" });
if (res.hasError) {
  LOG.fatal(res.error);
}
