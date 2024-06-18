import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  cli: {
    name: "buttery-tokens",
    description: "A CLI to develop and build buttery tokens",
    version: "0.0.1",
  },
  docs: {
    header: {
      title: "Buttery Tokens",
      logo: {
        src: "/images/buttery-tokens-logo.png",
        alt: "buttery-tokens",
      },
      links: [
        [
          {
            type: "internal",
            href: "/guides",
            text: "Guides",
          },
        ],
        [
          {
            type: "social",
            provider: "github",
            href: "https://github.com/drewdecarme/buttery-tools/tree/main/packages/buttery-tokens",
          },
        ],
      ],
    },
    order: {
      introduction: {
        display: "Intro",
        routeOrder: ["why-this", "why-this.because-so"],
      },
      "getting-started": {
        display: "Getting Started",
        routeOrder: [
          "introduction",
          "introduction.basic-components",
          "introduction.advanced-components",
          "quick-start-guide",
        ],
      },
      security: {
        display: "Securing your app",
        routeOrder: ["overview-of-security", "prevention-of-attacks"],
      },
      guides: {
        display: "Guides",
        routeOrder: ["guides"],
      },
    },
  },
  tokens: {
    importName: "_tokens",
    gridSystem: 4,
    prefix: "buttery-tokens",
    strict: true,
    suppressStrictWarnings: false,
    font: {
      size: 16,
      family: {
        heading:
          'Poppins, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        body: 'Poppins, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
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
          primary: 42,
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
        background: "#fff",
        surface: "#fff",
      },
    },
    custom: {
      "layout-header": 48,
    },
  },
};

export default config;
