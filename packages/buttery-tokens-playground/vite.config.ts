import { reactRouter } from "@react-router/dev/vite";
import { mergeConfig } from "vite";

import baseConfig from "./vite.config.base";
declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default mergeConfig(baseConfig, {
  plugins: [reactRouter()],
});
