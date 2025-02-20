import type { ButteryConfig } from "@buttery/core/config";

import { version } from "../package.json";

const config: ButteryConfig = {
  commands: {
    name: "spread",
    description:
      "A CLI that tests and proves out all of the functionality exposed by @buttery/commands.",
    version,
  },
};
export default config;
