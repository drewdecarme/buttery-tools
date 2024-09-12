import type { ButteryConfigTokens } from "@buttery/core";

export const ConfigTokensPlayground: ButteryConfigTokens = {
  importName: "playground",
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
    phone: 375,
    tablet: 768,
    desktop: 1280,
  },
  color: {
    mode: "presets",
    tone: "fluorescent",
    saturation: 82,
    brightness: 90,
    application: {
      hues: {
        primary: 47,
        secondary: 170,
        warning: 60,
        danger: 359,
        success: 131,
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
    "layout-header": 60,
  },
};
