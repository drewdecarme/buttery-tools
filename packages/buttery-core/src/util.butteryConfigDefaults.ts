import type { ButteryConfig } from "./types.buttery-config";
import type { ButteryConfigCommands } from "./types.buttery-config-commands";
import type { ButteryConfigDocs } from "./types.buttery-config-docs";
import type { ButteryConfigTokens } from "./types.buttery-config-tokens";

const systemFont = `system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;

export const butteryConfigDefaultTokens: ButteryConfigTokens = {
  importName: "random",
  prefix: "random-tokens",
  strict: true,
  gridSystem: 4,
  suppressStrictWarnings: false,
  font: {
    size: 16,
    family: {
      heading: systemFont,
      body: systemFont,
    },
    weight: {
      bold: 700,
      "semi-bold": 600,
      medium: 500,
      regular: 400,
      light: 300,
    },
    typography: {
      heading1: {
        fontFamily: "heading",
        fontSize: 74,
        lineHeight: 82,
      },
      heading2: {
        fontFamily: "heading",
        fontSize: 64,
        lineHeight: 74,
      },
    },
  },
  color: {
    mode: "presets",
    tone: "fluorescent",
    brightness: 95,
    saturation: 84,
    application: {
      hues: {
        primary: 32,
        secondary: 84,
      },
      variants: {
        mode: "auto",
      },
    },
    neutral: {
      base: "#000000",
      variants: {
        mode: "auto",
      },
    },
  },
  breakpoints: {
    phone: 375,
    tablet: 768,
    desktop: 1280,
  },
};
export const butteryConfigDefaultDocs: ButteryConfigDocs = {
  build: {
    target: "cloudflare-pages",
  },
};
export const butteryConfigDefaultCommands: ButteryConfigCommands = {
  name: "random",
  description: "A CLI that needs a description - CHANGE ME",
  commandsDir: "commands",
  version: "0.0.1",
};

export const butteryConfigDefaults: Required<ButteryConfig> = {
  tokens: butteryConfigDefaultTokens,
  docs: butteryConfigDefaultDocs,
  commands: butteryConfigDefaultCommands,
};
