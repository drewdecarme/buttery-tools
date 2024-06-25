import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  docs: {
    build: {
      target: "cloudflare-pages",
    },
    header: {
      title: "Buttery Docs",
      links: [
        [
          {
            type: "internal",
            text: "Under the hood",
            href: "/under-the-hood",
          },
        ],
        [
          {
            type: "social",
            provider: "github",
            href: "https://github.com/drewdecarme/buttery-tools/tree/main/packages/buttery-docs",
          },
        ],
      ],
    },
  },
};
export default config;
