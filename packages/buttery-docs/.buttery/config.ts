import type { ButteryConfig } from "@buttery/config";

const config: ButteryConfig = {
  docs: {
    buildTarget: "cloudflare-pages",
    header: {
      links: [
        [
          {
            type: "internal",
            text: "Docs",
            href: "/docs",
          },
        ],
      ],
    },
    order: {},
  },
};
export default config;
