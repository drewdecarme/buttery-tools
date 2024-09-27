import type { StorybookConfig } from "@storybook/react-vite";

import path, { dirname, join } from "node:path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */

// biome-ignore lint/suspicious/noExplicitAny: This is a storybook config and we don't care too much about the type of the path
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
  stories: ["../**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  staticDirs: ["./public"],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {
      builder: {
        viteConfigPath: path.resolve(__dirname, "./vite.config.ts"),
      },
    },
  },
};
export default config;
