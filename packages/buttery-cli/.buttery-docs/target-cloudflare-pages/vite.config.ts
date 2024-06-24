import path from "node:path";
import { vitePlugin as remix } from "@remix-run/dev";
import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from "@remix-run/dev";
import { getButteryDocsFiles } from "../../.buttery/cmds/docs/shared.getButteryDocFiles";
import { getButteryDocsGraph } from "../../.buttery/cmds/docs/shared.getButteryDocsGraph";
import { orderButteryDocFiles } from "../../.buttery/cmds/docs/shared.orderButteryDocFiles";
import type { ButteryDocsGraph } from "../../.buttery/cmds/docs/shared.types";
import { getButteryDocsDefineConfig } from "../../.buttery/cmds/docs/util.vite.defineBaseDocsConfig";

const defineDocsConfig = await getButteryDocsDefineConfig();

// https://vitejs.dev/config/
export default defineDocsConfig(({ butteryDocsConfig, butteryDocsDirs }) => ({
  // change the root here since we're looking at this directory
  root: import.meta.dirname,
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      appDirectory: path.resolve(import.meta.dirname, "./app"),
      buildDirectory: butteryDocsDirs.build.outDir,
      async routes(defineRoutes) {
        const files = await getButteryDocsFiles(butteryDocsConfig);
        const orderedFiles = orderButteryDocFiles(butteryDocsConfig, files);
        const graph = await getButteryDocsGraph(
          butteryDocsConfig,
          orderedFiles
        );

        const routes = defineRoutes((route) => {
          function createRouteFromGraph(graph: ButteryDocsGraph) {
            for (const graphValue of Object.values(graph)) {
              const { routeAbs, filepath, pages } = graphValue;
              const hasNestedPages = Object.keys(pages).length > 0;

              // escape the index page
              // if (routeAbs === "/") continue;

              route(routeAbs, filepath, { index: true });

              if (hasNestedPages) {
                // recurse
                createRouteFromGraph(pages);
              }
            }
          }
          createRouteFromGraph(graph);
          // route(
          //   "/",
          //   path.resolve(import.meta.dirname, "./app/routes/_layout.tsx"),
          //   () => {
          //     createRouteFromGraph(graph);
          //   }
          // );
        });
        return routes;
      },
    }),
  ],
}));
