import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  docs: {
    order: {
      guide: {
        display: "Guide",
        routeOrder: [
          "why-buttery-commands",
          "features",
          "getting-started",
          "routing",
          "writing-a-command",
        ],
      },
      reference: {
        display: "Reference",
        routeOrder: ["config"],
      },
    },
    header: {
      title: "Buttery Commands",
      logo: {
        src: "/buttery-commands-logo-5.png",
        alt: "buttery-commands",
      },
    },
  },
};
export default config;
