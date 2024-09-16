import type { ButteryConfig } from "../.buttery/commands/_buttery-config";
import { ConfigTokensDocs } from "./config.tokens.docs";
import { ConfigTokensPlayground } from "./config.tokens.playground";

const config: ButteryConfig = {
  commands: {
    name: "buttery",
    description:
      "The buttery ecosystem CLI. Bootstrapped and dog-fooded using @buttery/commands.",
    version: "0.0.1"
  },
  docs: {
    buildTarget: "cloudflare-pages",
    routeStrategy: "section-folders",
    header: {
      title: "buttery.tools",
      logo: {
        src: "/images/buttery-tools-butter-man-transparent.png",
        alt: "buttery-components-logo"
      },
      links: [
        [
          {
            type: "dropdown",
            text: "Products",
            items: [
              {
                text: "buttery.components",
                href: "/components",
                iconAlt: "components-logo",
                iconSrc: "/images/buttery-components-logo-transparent.png"
              },
              {
                text: "buttery.commands",
                href: "/commands",
                iconAlt: "commands-logo",
                iconSrc: "/images/buttery-components-logo-transparent.png"
              },
              {
                text: "buttery.docs",
                href: "/docs",
                iconAlt: "docs-logo",
                iconSrc: "/images/buttery-components-logo-transparent.png"
              },
              {
                text: "buttery.tokens",
                href: "/tokens",
                iconAlt: "tokens-logo",
                iconSrc: "/images/buttery-components-logo-transparent.png"
              },
              {
                text: "buttery.logs",
                href: "/logs",
                iconAlt: "logs-logo",
                iconSrc: "/images/buttery-components-logo-transparent.png"
              }
            ]
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
    },
    order: {
      introduction: {
        display: "Introduction",
        routeOrder: ["architecture", "how-is-this-different-than"]
      },
      commands: {
        display: "buttery.commands",
        routeOrder: []
      },
      docs: {
        display: "buttery.docs",
        routeOrder: []
      },
      components: {
        display: "buttery.components",
        routeOrder: [
          "getting-started",
          "getting-started.why",
          "getting-started.quick-start",
          "hooks",
          "hooks.useDynamicNode",
          "hooks.usePortal",
          "hooks.usePopover",
          "hooks.useDropdown",
          "hooks.useTooltip",
          "components",
          "components.modals",
          "components.modals.modal",
          "components.modals.drawer",
          "components.popovers",
          "components.popovers.toasts",
          "components.popovers.dropdown-menu",
          "components.popovers.dropdown-nav"
        ]
      },
      tokens: {
        display: "buttery.tokens",
        routeOrder: []
      },
      reference: {
        display: "Reference",
        routeOrder: []
      }
    }
  },
  tokens: [ConfigTokensDocs, ConfigTokensPlayground]
};
export default config;
