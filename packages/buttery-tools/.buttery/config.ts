import type { ButteryConfig } from "../.buttery/commands/_buttery-config";
import { ConfigTokensDocs } from "./config.tokens.docs";
import { ConfigTokensPlayground } from "./config.tokens.playground";

const config: ButteryConfig = {
  commands: {
    name: "buttery",
    description:
      "The buttery ecosystem CLI. Bootstrapped and dog-fooded using @buttery/commands.",
    version: "0.0.1"
  },
  docs: {
    build: {
      target: "cloudflare-pages"
    },
    header: {
      title: "buttery.tools"
    }
  },
  tokens: [ConfigTokensDocs, ConfigTokensPlayground]
};
export default config;
