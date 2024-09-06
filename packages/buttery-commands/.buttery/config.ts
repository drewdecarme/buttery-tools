import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  docs: {
    build: {
      target: "cloudflare-pages"
    },
    order: {
      guide: {
        display: "Guide",
        routeOrder: [
          "why-buttery-commands",
          "features",
          "getting-started",
          "routing",
          "writing-a-command"
        ]
      },
      reference: {
        display: "Reference",
        routeOrder: ["config"]
      }
    },
    header: {
      title: "Buttery Commands",
      logo: {
        src: "/images/buttery-commands-logo.png",
        alt: "buttery-commands"
      },
      links: [
        [
          {
            type: "internal",
            text: "Getting Started",
            href: "/guide/getting-started"
          }
        ],
        [
          {
            type: "social",
            provider: "github",
            href: "https://github.com/drewdecarme/buttery-tools"
          }
        ]
      ]
    }
  }
};
export default config;
