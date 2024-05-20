import path from "node:path";
import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  root: path.resolve(import.meta.dirname),
  cli: {
    name: "buttery",
    description:
      "The buttery ecosystem CLI. Bootstrapped and dog-fooded using buttery itself. Let's spread it on!",
    version: "0.0.1"
  }
};
export default config;
