import type { ButteryConfig } from "@buttery/core/config";

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
        [
          {
            type: "social",
            href: "https://github.com",
            label: "Github",
            provider: "github",
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
