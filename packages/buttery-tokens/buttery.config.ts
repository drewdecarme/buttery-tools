import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  root: import.meta.dirname,
  cli: {
    name: "buttery-tokens",
    description: "A CLI to develop and build buttery tokens",
    version: "0.0.1"
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
        body: 'Poppins, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
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
      "phone-small": 320,
      phone: 375,
      "phone-large": 414,
      "tablet-small": 480,
      tablet: 768,
      "tablet-large": 1024,
      "desktop-small": 1200,
      desktop: 1280,
      "desktop-large": 1400
    },
    color: {
      mode: "presets",
      tone: "jewel",
      saturation: 83,
      brightness: 76,
      hues: {
        primary: 244,
        secondary: 170,
        warning: 60,
        danger: 359
      },
      neutral: "#030305"
    }
  }
};

// TODO: when this changes, the tokens distro needs to be rebuilt

export default config;
