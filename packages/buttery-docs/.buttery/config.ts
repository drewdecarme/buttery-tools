import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  cli: {
    name: "buttery-docs",
    description:
      "A CLI to build the necessary assets required to render the Buttery Docs template in any remix site.",
    version: "0.0.1",
  },
  docs: {
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
  tokens: {
    importName: "_docs",
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
      "phone-small": 320,
      phone: 375,
      "phone-large": 414,
      "tablet-small": 480,
      tablet: 768,
      "tablet-large": 1024,
      "desktop-small": 1200,
      desktop: 1280,
      "desktop-large": 1400,
    },
    color: {
      mode: "presets",
      tone: "jewel",
      saturation: 83,
      brightness: 76,
      application: {
        hues: {
          primary: 198,
          secondary: 170,
          warning: 60,
          danger: 359,
        },
        variants: {
          mode: "auto",
          total: 10,
          scaleMin: 2,
          scaleMax: 2,
        },
      },
      neutral: {
        base: "#030305",
        variants: {
          mode: "auto",
          total: 10,
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
