import path from "node:path";

import { defineButteryDocsConfig } from "@buttery/docs";
import { vitePluginButteryDocsInteractivePreview } from "@buttery/docs/plugin-interactive-preview";

export default defineButteryDocsConfig({
  buildTarget: "cloudflare-pages",
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
            {
              text: "Buttery Meta",
              subText: "SSR'd meta tags for your SSR'd React app",
              href: "/meta",
              iconAlt: "meta-logo",
              iconSrc: "/images/buttery-logo-seo-transparent.png",
            },
          ],
        },
        {
          type: "internal",
          href: "/reference",
          text: "Reference",
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
    introduction: ["architecture", "how-is-this-different-than"],
    docs: ["introduction"],
    "react-components": [
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
    commands: [
      "getting-started",
      "getting-started.installation",
      "getting-started.project-structure",
      "guides",
      "guides.writing-commands",
      "guides.configuration",
      "guides.building-for-production",
      "reference",
      "reference.command-file",
      "architecture",
      "architecture.buildtime",
      "architecture.runtime",
    ],
  },
  vitePlugins: [
    vitePluginButteryDocsInteractivePreview({
      componentRootDir: path.resolve(
        import.meta.dirname,
        "../../example-components"
      ),
    }),
  ],
});
