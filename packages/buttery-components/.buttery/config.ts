import type { ButteryConfig } from "@buttery/core";
const config: ButteryConfig = {
  docs: {
    build: {
      target: "cloudflare-pages",
    },
    header: {
      title: "Buttery Components",
      links: [
        [
          {
            type: "social",
            provider: "github",
            href: "https://github.com/drewdecarme/buttery-tools/tree/feat/docs/packages/buttery-components",
          },
        ],
      ],
    },
  },
};
export default config;
