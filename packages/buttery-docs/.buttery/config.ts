import path from "node:path";
import type { ButteryConfig } from "@buttery/core/config";
import { vitePluginInteractivePreview } from "./docs/_plugins/vite-plugin-interactive-preview";

const config: ButteryConfig = {
  icons: {
    iconsDirectory: "../src/lib/app/components/icons",
  },
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
            type: "internal",
            text: "Components",
            href: "/components",
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
    vitePlugins: [
      vitePluginInteractivePreview({
        componentRootDir: path.resolve(
          import.meta.dirname,
          "../example-components"
        ),
        previewComponentPath: path.resolve(
          import.meta.dirname,
          "./docs/_components/InteractivePreview.tsx"
        ),
      }),
    ],
  },
  tokens: {
    namespace: "docs",
    gridSystem: 4,
    prefix: "buttery-docs",
    strict: true,
    suppressStrictWarnings: false,
    font: {
      size: 16,
      family: {
        heading:
          '"Source Sans 3", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        body: '"Source Sans 3", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      },
      weight: {
        bold: 700,
        "semi-bold": 600,
        medium: 500,
        regular: 400,
        light: 300,
      },
      typography: {},
    },

    breakpoints: {
      phone: 375,
      tablet: 768,
      desktop: 1280,
    },
    color: {
      brand: {
        mode: "category",
        tone: "jewel",
        saturation: 83,
        brightness: 76,
        hues: {
          primary: 198,
          secondary: 170,
          warning: 60,
          danger: 359,
        },
        variants: {
          mode: "auto",
          numOfVariants: 10,
          scaleMin: 2,
          scaleMax: 2,
        },
      },
      shade: {
        values: {
          neutral: "#030305",
        },
        variants: {
          mode: "auto",
          numOfVariants: 10,
          scaleMin: 5,
        },
      },
      static: {
        background: "#ffffff",
        surface: "#ffffff",
      },
    },
    custom: {
      "layout-header-height": {
        value: 64,
        storeAsRem: true,
      },
      "layout-max-width": {
        value: 1440,
        storeAsRem: true,
      },
    },
  },
};
export default config;
