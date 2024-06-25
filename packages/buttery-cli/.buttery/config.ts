import type { ButteryConfig } from "@buttery/core";
import { ConfigTokensDocs } from "./config.tokens.docs";
import { ConfigTokensPlayground } from "./config.tokens.playground";

const config: ButteryConfig = {
  commands: {
    name: "buttery",
    description:
      "The buttery ecosystem CLI. Bootstrapped and dog-fooded using buttery itself. Let's spread it on!",
    version: "0.0.1",
    commandsDir: "cmds",
  },
  docs: {
    build: {
      target: "cloudflare-pages",
    },
    header: {
      title: "Buttery CLI",
    },
  },
  tokens: [ConfigTokensDocs, ConfigTokensPlayground],
};
export default config;
