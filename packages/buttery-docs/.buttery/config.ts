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
    order: {
      docs: [
        "introduction",
        "guides",
        "guides.deployment",
        "guides.mono-repo",
        "guides.naming-files",
        "guides.routing",
        "guides.seo",
        "guides.writing",
      ],
    },
  },
};
export default config;
