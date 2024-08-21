import type { ButteryConfig } from "@buttery/core";
const config: ButteryConfig = {
  docs: {
    build: {
      target: "cloudflare-pages",
    },
    header: {
      title: "Buttery Components",
      logo: {
        alt: "buttery-components-logo",
        src: "/buttery-components-logo-transparent.png",
      },
      links: [
        [
          {
            type: "internal",
            text: "Getting Started",
            href: "/getting-started",
          },
          { type: "internal", text: "Components", href: "/components" },
          { type: "internal", text: "Hooks", href: "/hooks" },
        ],
        [
          {
            type: "social",
            provider: "github",
            href: "https://github.com/drewdecarme/buttery-tools/tree/feat/docs/packages/buttery-components",
          },
        ],
      ],
    },
    order: {
      "getting-started": {
        display: "Getting Started",
        routeOrder: ["quick-start", "why"],
      },
      components: {
        display: "Components",
        routeOrder: [
          "modals",
          "modals.modal",
          "modals.drawer",
          "popovers",
          "popovers.toasts",
          "popovers.dropdown-menu",
          "popovers.dropdown-nav",
        ],
      },
    },
  },
};
export default config;
