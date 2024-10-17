import type { ResolvedButteryConfig } from "@buttery/config";
import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import rehypeTOC from "@stefanprobst/rehype-extract-toc";
import rehypeTOCExport from "@stefanprobst/rehype-extract-toc/mdx";
import react from "@vitejs/plugin-react";
import wyw from "@wyw-in-js/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";
import virtual from "vite-plugin-virtual";
import type { ButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import { getButteryDocsRouteManifest } from "./docs.getButteryDocsRouteManifest";
import { getButteryDocsVirtualModules } from "./docs.getButteryDocsVIrtualModules";

export function getButteryDocsViteConfig(
  config: ResolvedButteryConfig<"docs">,
  dirs: ButteryDocsDirectories
) {
  // Assemble the route manifest along with
  // the virtual modules that will tell vite exactly where
  // the dynamic imports are. This allows us to get around the issue
  // where you can't supply the async import a dynamic path
  const routeManifest = getButteryDocsRouteManifest(config, dirs);
  const virtualModules = getButteryDocsVirtualModules(config, routeManifest);

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
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
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
      virtual({
        "virtual:data": virtualModules.data,
        "virtual:routes": virtualModules.routes,
      }),
      wyw({
        include: "/**/*.(ts|tsx)",
        babelOptions: {
          compact: false,
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),
    ],
  });

  return viteConfig;
}
