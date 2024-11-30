import path from "node:path";
import react from "@vitejs/plugin-react";
import wyw from "@wyw-in-js/vite";
import { defineConfig, build as viteBuild } from "vite";
import { dependencies } from "../package.json";
import { LOG } from "../src/utils";

/**
 * Builds the library that the app uses for client and server components
 * as well as the components needed to render the shell of the app.
 *
 * This is done here since the components need to be built outside of the app.
 * the `wyw` plugin ignores any vite resolved IDs from node modules so we can't built
 * these styles when they're being sourced from node_modules. So we build them
 * using Vite here and then just import them much like we to the ButteryDocsServer
 * and ButteryDocsClient apps
 */
async function buildLibrary() {
  LOG.debug(
    "Building the @buttery/docs library for consumption in the SSR app..."
  );

  const entry = ["client", "server", "app"].reduce((accum, entryName) => {
    const entryPath = path.resolve(
      import.meta.dirname,
      `../src/lib/${entryName}/index.ts`
    );
    return Object.assign(accum, { [entryName]: entryPath });
  }, {});

  try {
    const config = defineConfig({
      logLevel: "silent",
      build: {
        lib: {
          formats: ["es"],
          entry,
          fileName(_format, entryName) {
            return `${entryName}/index.js`;
          },
        },
        rollupOptions: {
          external: [
            ...Object.keys(dependencies),
            "@buttery/tokens",
            "@buttery/meta/react",
            "@buttery/docs/css",
            "@buttery/docs/app",
            "@buttery/docs/server",
            "@buttery/docs/client",
            "@buttery/core",
            "@buttery/logs",
            "react/jsx-runtime",
            "react-dom/server",
            "virtual:data",
            "virtual:routes",
            /node_modules/,
          ],
          output: {
            dir: path.resolve(import.meta.dirname, "../dist"),
            // preserveModules: true,
          },
        },
      },
      plugins: [
        react(),
        wyw({
          include: ["**/*.{ts,tsx}"],
          babelOptions: {
            presets: ["@babel/preset-typescript", "@babel/preset-react"],
          },
        }),
      ],
    });
    await viteBuild(config);
    LOG.debug(
      "Building the @buttery/docs library for consumption in the SSR app... done."
    );
  } catch (error) {
    throw LOG.fatal(
      new Error(`Error when building the @buttery/docs library: ${error}`)
    );
  }
}

buildLibrary();
