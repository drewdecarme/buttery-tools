import type { ButteryConfigTokens } from "./commands/_buttery-config";

export const ConfigTokensDocs: ButteryConfigTokens = {
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
      body: '"Source Sans 3", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
    },
    weight: {
      bold: 700,
      "semi-bold": 600,
      medium: 500,
      regular: 400,
      light: 300
    },
    typography: {}
  },

  breakpoints: {
    phone: 375,
    tablet: 768,
    desktop: 1280
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
        danger: 359
      },
      variants: {
        mode: "auto",
        numOfVariants: 10,
        scaleMin: 2,
        scaleMax: 2
      }
    },
    shade: {
      values: {
        neutral: "#030305"
      },
      variants: {
        mode: "auto",
        numOfVariants: 10
      }
    },
    static: {
      background: "#ffffff",
      surface: "#ffffff"
    }
  },
  custom: {
    "layout-header-height": {
      value: 64,
      storeAsRem: true
    },
    "layout-max-width": {
      value: 1440,
      storeAsRem: true
    }
  }
};
