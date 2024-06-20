import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  commands: {
    name: "buttery",
    description:
      "The buttery ecosystem CLI. Bootstrapped and dog-fooded using buttery itself. Let's spread it on!",
    version: "0.0.1",
    commandsDir: "cmds",
  },
  docs: {
    header: {
      title: "Buttery CLI",
    },
  },
};
export default config;
