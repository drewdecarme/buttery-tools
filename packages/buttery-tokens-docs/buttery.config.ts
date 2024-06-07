import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  root: import.meta.dirname,
  docs: {
    order: {
      introduction: {
        display: "Intro",
        routeOrder: ["_index", "why-this"],
      },
      "getting-started": {
        display: "Getting Started",
        routeOrder: [
          "introduction",
          "introduction.basic-components",
          "introduction.advanced-components",
          "quick-start-guide",
        ],
      },
      security: {
        display: "Securing your app",
        routeOrder: ["overview-of-security", "prevention-of-attacks"],
      },
    },
  },
};
export default config;
