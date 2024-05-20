import type { ButteryConfig } from "@buttery/cli";

const config: ButteryConfig = {
  cli: {
    name: "buttery-docs",
    description:
      "A CLI to build the necessary assets required to render the Buttery Docs template in any remix site.",
    root: import.meta.dirname,
    version: "0.0.1"
  },
  tokens: {}
};
export default config;
