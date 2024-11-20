import type { ButteryConfigCommands } from "./buttery-config.types.commands.js";
import type { ButteryConfigDocs } from "./buttery-config.types.docs.js";
import type { ButteryConfigIcons } from "./buttery-config.types.icons.js";
import type { ButteryConfig } from "./buttery-config.types.js";
import type { ButteryConfigTokens } from "./buttery-config.types.tokens.js";

const systemFont = `system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;

export const butteryConfigDefaultTokens: ButteryConfigTokens = {
  namespace: "random",
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
    brand: {
      mode: "category",
      tone: "fluorescent",
      brightness: 95,
      saturation: 84,
      hues: {
        primary: 32,
        secondary: 84,
      },
      variants: {
        mode: "auto",
        numOfVariants: 10,
      },
    },
    shade: {
      values: {
        neutral: "#000000",
      },
      variants: {
        mode: "auto",
        numOfVariants: 10,
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
  buildTarget: "cloudflare-pages",
};
export const butteryConfigDefaultCommands: ButteryConfigCommands = {
  name: "random",
  description: "A CLI that needs a description - CHANGE ME",
  commandsDir: "commands",
  version: "0.0.1",
};
export const butteryConfigDefaultIcons: ButteryConfigIcons = {
  iconsDirectory: undefined,
};

export const butteryConfigDefaults: Required<ButteryConfig> = {
  tokens: butteryConfigDefaultTokens,
  docs: butteryConfigDefaultDocs,
  commands: butteryConfigDefaultCommands,
  icons: butteryConfigDefaultIcons,
};
