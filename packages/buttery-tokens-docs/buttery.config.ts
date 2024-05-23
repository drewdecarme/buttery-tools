import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  root: import.meta.dirname,
  docs: {
    docsDirectory: "./routes/_docs"
  }
};
export default config;
