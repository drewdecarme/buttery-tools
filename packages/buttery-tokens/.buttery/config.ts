import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  docs: {
    build: {
      target: "cloudflare-pages",
    },
    header: {
      title: "Buttery Tokens",
      logo: {
        src: "/images/buttery-tokens-logo.png",
        alt: "buttery-tokens",
      },
      links: [
        [
          {
            type: "internal",
            href: "/guides",
            text: "Guides",
          },
        ],
        [
          {
            type: "social",
            provider: "github",
            href: "https://github.com/drewdecarme/buttery-tools/tree/main/packages/buttery-tokens",
          },
        ],
      ],
    },
    order: {
      introduction: {
        display: "Intro",
        routeOrder: ["why-this", "why-this.because-so"],
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
      guides: {
        display: "Guides",
        routeOrder: ["guides"],
      },
    },
  },
};

export default config;
