import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  root: import.meta.dirname,
  cli: {
    name: "buttery-docs",
    description:
      "A CLI to build the necessary assets required to render the Buttery Docs template in any remix site.",
    version: "0.0.1"
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
          'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        body: 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
      },
      weight: {
        bold: 700,
        "semi-bold": 600,
        medium: 500,
        regular: 400,
        light: 300
      },
      typography: {}
    }
  }
};
export default config;
