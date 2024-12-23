import { reactRouter } from "@react-router/dev/vite";
import { mergeConfig } from "vite";

import baseConfig from "./vite.config.base";

export default mergeConfig(baseConfig, {
  plugins: [reactRouter()],
});
