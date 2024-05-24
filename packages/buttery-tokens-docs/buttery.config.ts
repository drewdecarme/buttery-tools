import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  root: import.meta.dirname,
  docs: {
    docsDirectory: "./app/routes/_docs",
    framework: "remix",
    docsPrefix: "_docs"
  }
};
export default config;
