import type { ResolvedButteryConfig } from "@buttery/core/config";
import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import rehypeTOC from "@stefanprobst/rehype-extract-toc";
import rehypeTOCExport from "@stefanprobst/rehype-extract-toc/mdx";
import react from "@vitejs/plugin-react";
import wyw from "@wyw-in-js/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { type Plugin, defineConfig } from "vite";
import type { ButteryDocsDirectories } from "./getButteryDocsDirectories";
import { getButteryDocsRouteManifest } from "./getButteryDocsRouteManifest";
import {
  type ButteryDocsVirtualModules,
  getButteryDocsVirtualModules,
} from "./getButteryDocsVirtualModules";
import { LOG } from "./utils";

export function getButteryDocsViteConfig(
  config: ResolvedButteryConfig<"docs">,
  dirs: ButteryDocsDirectories
) {
  const viteConfig = defineConfig({
    cacheDir: dirs.app.viteCacheDir,
    publicDir: dirs.srcDocs.public,
    resolve: {
      preserveSymlinks: true,
      extensions: [".js", ".jsx", ".ts", ".tsx", ".mdx"],
      alias: {
        "@docs": dirs.srcDocs.root,
      },
    },
    optimizeDeps: {
      include: [
        "@buttery/logger",
        "react-router-dom",
        "@buttery/components",
        "@buttery/tokens/docs",
        "@buttery/docs-ui",
        "react",
        "react-dom",
        "react-dom/client",
      ],
    },
    plugins: [
      mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          rehypeTOC,
          rehypeTOCExport,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              headingProperties: {
                className: "heading",
              },
            },
          ],
          [
            rehypeShiki,
            {
              theme: "dark-plus",
            },
          ],
        ],
      }),
      react(),
      wyw({
        include: "/**/*.(ts|tsx)",
        babelOptions: {
          compact: false,
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),
      vitePluginButteryDocsVirtual(config, dirs),
    ],
  });

  return viteConfig;
}

function vitePluginButteryDocsVirtual(
  config: ResolvedButteryConfig<"docs">,
  dirs: ButteryDocsDirectories
): Plugin {
  // Assemble the route manifest along with
  // the virtual modules that will tell vite exactly where
  // the dynamic imports are. This allows us to get around the issue
  // where you can't supply the async import a dynamic path
  let routeManifest = getButteryDocsRouteManifest(config, dirs);
  let vModules = getButteryDocsVirtualModules(config, routeManifest);
  const vModuleIds = Object.keys(vModules);
  const resolvedVModulePrefix = "\0";

  return {
    name: "vite-plugin-buttery-docs-virtual",
    configureServer(server) {
      server.watcher.add(dirs.srcDocs.root);
      server.watcher.on("all", (_event, path) => {
        // Only process things inside docs directory
        if (!path.startsWith(dirs.srcDocs.root)) return;
        LOG.debug("A user doc has changed. Updating all application data...");

        // Rebuild the static data
        LOG.debug("Rebuilding virtual modules");
        routeManifest = getButteryDocsRouteManifest(config, dirs);
        vModules = getButteryDocsVirtualModules(config, routeManifest);

        // Loop through the virtual modules and invalidate them
        for (const vModuleId in vModuleIds) {
          const vModule = server.moduleGraph.getModuleById(vModuleId);
          if (!vModule) {
            continue;
          }
          LOG.debug(`Invaliding vModule: ${vModuleId}`);
          server.moduleGraph.invalidateModule(vModule);
        }

        // Trigger a hot update
        server.ws.send({
          type: "full-reload",
        });
      });
    },
    resolveId(id) {
      const vModuleId = vModuleIds.find((vModuleId) => vModuleId === id);
      if (vModuleId) return resolvedVModulePrefix.concat(vModuleId);
      return null;
    },
    load(id) {
      const vModuleId = vModuleIds.find(
        (vModuleId) => resolvedVModulePrefix.concat(vModuleId) === id
      );
      if (vModuleId) {
        const module = vModules[vModuleId as keyof ButteryDocsVirtualModules];
        return module;
      }
      return null;
    },
  };
}
