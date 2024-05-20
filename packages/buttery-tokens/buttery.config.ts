import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  root: import.meta.dirname,
  cli: {
    name: "buttery-tokens",
    description: "A CLI to develop and build buttery tokens",
    version: "0.0.1"
  }
};

export default config;
