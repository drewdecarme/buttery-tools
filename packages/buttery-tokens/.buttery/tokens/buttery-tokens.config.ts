import { defineTokensConfig } from "@buttery/tokens";

export default defineTokensConfig({
  runtime: {
    namespace: "playground",
    prefix: "playground",
    strict: true,
    suppressStrictWarnings: false,
  },
  gridSystem: 4,
  font: {
    baseSize: 16,
    families: {
      logo: `"Poppins"`,
      heading: `"Inter"`,
      body: `"Mulish"`,
      code: `"Consolas"`,
    },
    weights: {
      bold: 700,
      "semi-bold": 600,
      medium: 500,
      regular: 400,
      light: 300,
    },
    variants: {},
  },
  breakpoints: {
    phone: 375,
    tablet: 768,
    desktop: 1280,
  },
  color: {
    brand: {
      type: "fluorescent",
      saturation: 82,
      brightness: 90,
      colors: {
        primary: {
          hue: 47,
          variants: 10,
        },
        secondary: {
          hue: 170,
          variants: 10,
        },
        warning: {
          hue: 60,
          variants: 6,
        },
        danger: {
          hue: 359,
          variants: 4,
        },
        success: {
          hue: 131,
          variants: 10,
        },
      },
    },
    neutral: {
      background: "#fff",
      surface: "#fff",
      neutral: {
        hex: "#030305",
        variants: {
          dark: "#030304",
          light: "#030306",
        },
      },
    },
  },
  custom: {
    "layout-header-height": { value: 100, storeAsRem: true },
    "layout-max-width": { value: 1280, storeAsRem: true },
    "layout-gutters": { value: 32, storeAsRem: true },
    "layout-section-offset-top": { value: 32, storeAsRem: true },
  },
});
