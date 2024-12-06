import path from "node:path";

import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import wyw from "@wyw-in-js/vite";
import { defineConfig } from "vite";

import type { ResolvedButteryTokensConfig } from "../config/getButteryTokensConfig.js";

declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }
}

export function getPlaygroundViteConfig({ dirs }: ResolvedButteryTokensConfig) {
  return defineConfig({
    root: dirs.playground.app,
    publicDir: path.resolve(dirs.playground.app, "./public"),
    clearScreen: false, // we want to see all of the logs,
    server: {
      port: 1500,
      open: true,
    },
    plugins: [
      // @ts-expect-error Includes call signatures; NodeNext creates a misread on it
      wyw({
        include: "/**/*.(ts|tsx)",
        babelOptions: {
          compact: false,
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),
      remixCloudflareDevProxy(),
      remix({
        manifest: true,
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_singleFetch: true,
          v3_lazyRouteDiscovery: true,
        },
      }),
    ],
  });
}
