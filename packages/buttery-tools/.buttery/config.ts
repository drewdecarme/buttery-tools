import path from "node:path";
import type { ButteryConfig } from "@buttery/config";
import "../../buttery-docs/.buttery/docs";

const getDocDirectory = (relPath: string) => path.resolve(__dirname, relPath);

const butteryDocsPath = getDocDirectory("../../buttery-docs/.buttery/docs");

const config: ButteryConfig = {
  commands: {
    name: "buttery",
    description:
      "The buttery ecosystem CLI. Bootstrapped and dog-fooded using @buttery/commands.",
    version: "0.0.1",
  },
  docs: {
    buildTarget: "cloudflare-pages",
    routing: {
      pageDirectories: [
        {
          routeName: "docs",
          path: butteryDocsPath,
        },
      ],
    },
    header: {
      title: "buttery.tools",
      logo: {
        src: "/images/buttery-tools-butter-man-transparent.png",
        alt: "buttery-components-logo",
      },
      links: [
        [
          {
            type: "dropdown",
            text: "View the tools",
            items: [
              {
                text: "Buttery Components",
                subText:
                  "Headless, accessible & style method agnostic React components that you can import, re-export and/or copy & paste",
                href: "/react-components",
                iconAlt: "components-logo",
                iconSrc: "/images/buttery-logo-components.png",
              },
              {
                text: "Buttery Commands",
                subText:
                  "Build a TS CLI the same way you would define NextJS or Remix routes",
                href: "/commands",
                iconAlt: "commands-logo",
                iconSrc: "/images/buttery-logo-commands.png",
              },
              {
                text: "Buttery Docs",
                subText: "Co-located, SSR ready, dead simple .md & .mdx docs",
                href: "/docs",
                iconAlt: "docs-logo",
                iconSrc: "/images/buttery-logo-docs.png",
              },
              {
                text: "Buttery Tokens",
                subText:
                  "Easily create, use, and scale a pure CSS design token system with 100% type-safety",
                href: "/tokens",
                iconAlt: "tokens-logo",
                iconSrc: "/images/buttery-logo-tokens.png",
              },
              {
                text: "Buttery Logs",
                subText: "Isomorphic logging for full-stack apps",
                href: "/logs",
                iconAlt: "logs-logo",
                iconSrc: "/images/buttery-logo-logs.png",
              },
            ],
          },
        ],
        [
          {
            type: "social",
            provider: "github",
            href: "https://github.com/drewdecarme/buttery-tools",
            label: "View Buttery Tools on GitHub",
          },
        ],
      ],
    },
    order: {
      introduction: {
        display: "Introduction",
        routeOrder: ["architecture", "how-is-this-different-than"],
      },
      commands: {
        display: "buttery.commands",
        routeOrder: [],
      },
      docs: {
        display: "buttery.docs",
        routeOrder: [],
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
          "components.popovers.dropdown-nav",
        ],
      },
      tokens: {
        display: "buttery.tokens",
        routeOrder: [],
      },
      reference: {
        display: "Reference",
        routeOrder: [],
      },
    },
  },
};
export default config;
