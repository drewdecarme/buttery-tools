import { tryHandle } from "@buttery/utils/isomorphic";

import { dev } from "../src/cli-scripts/dev.js";
import { LOG } from "../src/utils/util.logger.js";

const res = await tryHandle(dev)({ logLevel: "debug", prompt: true });
if (res.hasError) {
  LOG.fatal(res.error);
}
