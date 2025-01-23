import { defineTokensConfig } from "@buttery/tokens";

export default defineTokensConfig({
  runtime: {
    namespace: "docs",
    prefix: "buttery-docs",
    suppressStrictWarnings: false,
    strict: true,
  },
  gridSystem: 4,
  breakpoints: {
    phone: 375,
    tablet: 768,
    desktop: 1280,
  },
  font: {
    baseSize: 16,
    fallback: "system-ui",
    families: {
      heading: "'Source Sans 3'",
      body: "'Source Sans 3'",
    },
    weights: {
      bold: 700,
      "semi-bold": 600,
      medium: 500,
      regular: 400,
      light: 300,
    },
  },
  color: {
    brand: {
      type: "jewel",
      saturation: 83,
      brightness: 76,
      colors: {
        primary: {
          hue: 198,
          variants: 10,
        },
        secondary: {
          hue: 170,
          variants: 10,
        },
        warning: {
          hue: 60,
          variants: 10,
        },
        danger: {
          hue: 359,
          variants: 10,
        },
      },
    },
    neutral: {
      neutral: {
        hex: "#030305",
        variants: 10,
      },
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
});
