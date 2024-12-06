import type { ButteryConfig } from "@buttery/core/config";

const config: ButteryConfig = {
  namespace: "playground",
  gridSystem: 4,
  prefix: "buttery-tokens",
  strict: true,
  suppressStrictWarnings: false,
  font: {
    size: 16,
    fallback:
      'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    family: {
      heading: "Poppins",
      body: "Poppins",
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
      type: "fluorescent",
      saturation: 82,
      brightness: 90,
      colors: {
        primary: {
          hue: 47,
          variants: 10, // number (auto color & name)
        },
        secondary: {
          hue: 170,
          variants: ["50", "100", "200"], // array (auto name)
        },
        warning: {
          hue: 60, // hue or hex (hex is available in )
          variants: 6,
        },
      },
    },
    static: {
      background: "#fff",
      surface: "#fff",
      neutral: {
        hex: "#030305",
        // variants: 10, // number (auto color & name)
        // variants: ["50", "100", "200"], // array (auto name)
        variants: {
          // object (full control over name and color)
          "50": "#ccc",
          "100": "#eee",
        },
      },
    },
  },
  custom: {
    "layout-header": 60,
  },
};
export default config;
