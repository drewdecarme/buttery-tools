import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  root: import.meta.dirname,
  docs: {
    framework: "remix",
    docsPrefix: "_docs",
    ordering: [
      "/getting-started/introduction",
      "/getting-started/introduction/basic-components",
      "/getting-started/introduction/advanced-components",
      "/security/overview-of-security"
    ]
  }
};
export default config;
