// targets/remix/cloudflare-pages/vite.config.ts
import path3 from "node:path";
import mdx from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/@mdx-js/rollup/index.js";
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy
} from "file:///Users/drewdecarme/git/personal/buttery-tools/packages/buttery-docs/node_modules/@remix-run/dev/dist/index.js";
import rehypeShiki from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/@shikijs/rehype/dist/index.mjs";
import wyw from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/@wyw-in-js/vite/esm/index.mjs";
import chokidar from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/chokidar/index.js";
import rehypeAutolinkHeadings from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/rehype-autolink-headings/index.js";
import rehypeSlug2 from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/rehype-slug/index.js";
import remarkFrontmatter from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/remark-frontmatter/index.js";
import { defineConfig } from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/vite/dist/node/index.js";

// commands/_utils/util.getButteryDocsConfig.ts
import { getButteryConfig } from "file:///Users/drewdecarme/git/personal/buttery-tools/packages/buttery-core/dist/index.js";
async function getButteryDocsConfig() {
  return await getButteryConfig("docs");
}

// commands/_utils/util.getButteryDocsDirectories.ts
import path from "node:path";
function getButteryDocsDirectories(config) {
  return {
    docs: path.resolve(config.configBase.root, "./docs"),
    public: path.resolve(config.configBase.root, "./docs/public")
  };
}

// commands/_utils/util.getButteryDocsGraph.ts
import { readdir } from "node:fs/promises";
import path2 from "node:path";

// commands/_utils/util.getRoutePath.ts
function getRoutePath(filename) {
  if (filename === "_index") {
    return "/";
  }
  return "/".concat(filename.split(".").join("/"));
}

// commands/_utils/util.logger.ts
import { ButteryLogger } from "file:///Users/drewdecarme/git/personal/buttery-tools/packages/buttery-logger/dist/index.js";
var LOG_DOCS = new ButteryLogger({
  prefix: "@buttery/docs",
  shouldPrintLevel: false,
  format: "basic"
});

// commands/_utils/util.file.parseFilename.ts
var parseFilename = (filename) => {
  return {
    section: filename.split(".")[0]
  };
};

// commands/_utils/util.mdx.orderMdxFiles.ts
function orderFiles({
  docsConfig: { order },
  files
}) {
  let reconciledOrder = order;
  if (!order) {
    LOG_DOCS.warning(
      "No custom order defined... grouping files based upon section"
    );
    reconciledOrder = files.reduce((accum, file) => {
      const { section } = parseFilename(file.filename);
      console.log(section);
      return accum;
    }, {});
    return files;
  }
  const oFiles = [];
  for (const section in order) {
    const sectionOrder = order[section].routeOrder;
    for (const sectionRoute of sectionOrder) {
      const sectionIndexFile = files.find((file) => file.filename === section);
      const oFilesHasSectionIndexFile = oFiles.find(
        (f) => f.filename === sectionIndexFile?.filename
      );
      if (!oFilesHasSectionIndexFile && sectionIndexFile) {
        oFiles.push(sectionIndexFile);
      }
      const orderedFile = files.find(
        (file) => file.filename === `${section}.${sectionRoute}`
      );
      if (orderedFile)
        oFiles.push(orderedFile);
    }
  }
  for (const file of files) {
    const fileAlreadyOrdered = oFiles.find(
      (oFile) => oFile.filename === file.filename
    );
    if (!fileAlreadyOrdered && file.filename === "_index") {
      oFiles.unshift(file);
    } else if (!fileAlreadyOrdered) {
      LOG_DOCS.warning(
        `No order defined for "${file.filename}". Ordering arbitrarily.`
      );
      oFiles.push(file);
    }
  }
  return oFiles;
}

// commands/_utils/util.getButteryDocsGraphValueMeta.ts
async function getButteryDocsGraphValueMeta({
  frontmatter,
  filename
}) {
  if (!frontmatter.title) {
    LOG_DOCS.warning(
      `"${filename}" is missing a frontmatter title. "${filename}" will be used temporarily. Please ensure you add the title property in the document's frontmatter.`
    );
  }
  return {
    title: frontmatter?.title ?? ""
  };
}

// commands/_utils/util.getButteryDocsGraphValueSectionAndSegments.ts
var getButteryDocsGraphValueSectionAndSegments = (fileName) => {
  const allSegments = fileName.split(".");
  const [section, ...segments] = allSegments;
  return {
    section,
    segments
  };
};

// commands/_utils/util.getButteryDocsGraphValueTOC.ts
import rehypeParse from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/rehype-parse/index.js";
import rehypeSlug from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/rehype-slug/index.js";
import rehypeStringify from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/rehype-stringify/index.js";
import remarkMdx from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/remark-mdx/index.js";
import remarkParse from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/remark-parse/index.js";
import remarkRehype from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/remark-rehype/index.js";
import { unified } from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/unified/index.js";
import { visit } from "file:///Users/drewdecarme/git/personal/buttery-tools/packages/buttery-docs/node_modules/unist-util-visit/index.js";
function getButteryDocsGraphValueTOC(markdownContent) {
  const file = unified().use(remarkParse).use(remarkMdx).use(remarkRehype).use(rehypeSlug).use(rehypeStringify).processSync(markdownContent);
  const tree = unified().use(rehypeParse, { fragment: true }).parse(file.toString());
  const toc = [];
  const stack = [];
  visit(tree, "element", (node) => {
    if (node.tagName.match(/^h[2-6]$/) && node.properties && node.properties.id) {
      const level = Number.parseInt(node.tagName[1], 10);
      const title = node.children.map((child) => {
        if (child.type === "text")
          return child.value;
        if (child.type === "h1")
          return "";
        if (child.type === "element" && (child.tagName === "a" || child.tagName === "code")) {
          return child.children.map((aChild) => aChild.value).join("");
        }
        return "";
      }).join("");
      const link = `#${node.properties.id}`;
      const headerItem = {
        level,
        title,
        link,
        children: []
      };
      while (stack.length && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      if (stack.length) {
        stack[stack.length - 1].children.push(headerItem);
      } else {
        toc.push(headerItem);
      }
      stack.push(headerItem);
    }
  });
  return toc;
}

// commands/_utils/util.mdx.getMdxFileContent.ts
import { readFile } from "node:fs/promises";
import matter from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/gray-matter/index.js";
async function getMdxFileContent(filepath) {
  const rawMdxContent = await readFile(filepath, { encoding: "utf8" });
  const { data: frontmatter, content: mdxContent } = matter(rawMdxContent);
  return {
    frontmatter,
    mdxContent
  };
}

// commands/_utils/util.mex.parseMdxFile.ts
var parseMdxFile = async ({
  filename,
  fsPath,
  routePath
}) => {
  try {
    const { frontmatter, mdxContent } = await getMdxFileContent(fsPath);
    const meta = await getButteryDocsGraphValueMeta({ frontmatter, filename });
    const toc = getButteryDocsGraphValueTOC(mdxContent);
    const { segments, section } = getButteryDocsGraphValueSectionAndSegments(filename);
    return {
      fsPath,
      filename,
      toc,
      meta,
      section,
      routeAbs: routePath,
      segments
    };
  } catch (error) {
    throw error;
  }
};

// commands/_utils/util.getButteryDocsGraph.ts
var createGraph = async ({
  files,
  docsConfig
}) => {
  LOG_DOCS.debug("Generating graph representation of docs...");
  const graph = {};
  async function insertNode(file) {
    const parsedFile = await parseMdxFile(file);
    if (!parsedFile)
      return;
    const {
      meta: { title },
      section,
      segments,
      // content,
      routeAbs,
      toc
    } = parsedFile;
    const sectionTitle = docsConfig?.order?.[section]?.display ?? section.replace(/-/g, " ");
    if (section && !graph[section]) {
      graph[section] = {
        title: sectionTitle,
        filepath: file.fsPath,
        routeAbs: `/${section === "_index" ? "" : section}`,
        routeRel: section === "_index" ? "/" : section,
        toc: [],
        pages: {}
      };
    }
    let currentGraph = section ? graph[section].pages : graph;
    for (const segmentIndex in segments) {
      const i = Number(segmentIndex);
      const segment = segments[i];
      if (!currentGraph[segment]) {
        currentGraph[segment] = {
          title: "",
          filepath: "",
          routeAbs: "",
          routeRel: "",
          toc: [],
          pages: {}
        };
      }
      if (i === segments.length - 1) {
        currentGraph[segment].title = title;
        currentGraph[segment].filepath = file.fsPath;
        currentGraph[segment].routeAbs = routeAbs;
        currentGraph[segment].routeRel = segment;
        currentGraph[segment].toc = toc;
      } else {
        currentGraph = currentGraph[segment].pages;
      }
    }
  }
  for (const fileIndex in files) {
    const file = files[fileIndex];
    await insertNode(file);
  }
  LOG_DOCS.debug("Generating graph representation of docs... done.");
  return graph;
};
async function getButteryDocsGraph(config) {
  const docsDirectories = getButteryDocsDirectories(config);
  const docsDirContents = await readdir(docsDirectories.docs, {
    recursive: false,
    withFileTypes: true
  });
  const docsDirFiles = docsDirContents.reduce((accum, dirent) => {
    const isFile = dirent.isFile();
    if (!isFile)
      return accum;
    const fsPath = dirent.parentPath.concat("/").concat(dirent.name);
    const filename = path2.parse(dirent.name).name;
    const routePath = getRoutePath(filename);
    return accum.concat({
      fsPath,
      filename,
      routePath
    });
  }, []);
  const files = orderFiles({
    docsConfig: config.docs,
    files: docsDirFiles
  });
  const docsGraph = await createGraph({
    docsConfig: config.docs,
    files
  });
  return docsGraph;
}

// commands/_utils/vite-plugin-transform-markdown-asset-path.ts
function transformMarkdownAssetPath() {
  return {
    name: "markdown-image-path-transform",
    transform(code, id) {
      if (id.endsWith(".md")) {
        const transformedCode = code.replace(
          /!\[([^\]]*)\]\(\.\/public\/([^)]*)\)/g,
          "![$1](/$2)"
        );
        return {
          code: transformedCode,
          map: null
        };
      }
    }
  };
}

// targets/remix/cloudflare-pages/vite.config.ts
var __vite_injected_original_dirname = "/Users/drewdecarme/git/personal/buttery-tools/packages/buttery-docs/targets/remix/cloudflare-pages";
var butteryDocsConfig = await getButteryDocsConfig();
var butteryDocsDirectories = getButteryDocsDirectories(butteryDocsConfig);
var vite_config_default = defineConfig({
  root: __vite_injected_original_dirname,
  publicDir: butteryDocsDirectories.public,
  server: {
    port: 1347,
    hmr: {
      port: 443
    },
    fs: {
      strict: false
    }
  },
  plugins: [
    {
      name: "custom-watcher",
      configureServer(server) {
        const customWatcher = chokidar.watch(butteryDocsDirectories.docs);
        LOG_DOCS.watch(
          `Listening for changes to files in: '${butteryDocsDirectories.docs}'`
        );
        customWatcher.on("change", (path4) => {
          LOG_DOCS.info(`"${path4}" has changed... reloading.`);
          server.ws.send({
            type: "full-reload",
            path: path4
          });
        });
      }
    },
    transformMarkdownAssetPath(),
    mdx({
      remarkPlugins: [remarkFrontmatter],
      rehypePlugins: [
        rehypeSlug2,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            headingProperties: {
              className: "heading"
            }
          }
        ],
        [
          rehypeShiki,
          {
            theme: "dark-plus"
          }
        ]
      ]
    }),
    wyw({
      include: "/**/*.(ts|tsx)",
      babelOptions: {
        presets: ["@babel/preset-typescript", "@babel/preset-react"]
      }
    }),
    remixCloudflareDevProxy(),
    remix({
      appDirectory: path3.resolve(__vite_injected_original_dirname, "./app"),
      async routes(defineRoutes) {
        const butteryDocsGraph = await getButteryDocsGraph(butteryDocsConfig);
        console.log(JSON.stringify(butteryDocsGraph, null, 2));
        const routes = defineRoutes((route) => {
          function createRouteFromGraph(graph) {
            for (const graphValue of Object.values(graph)) {
              const { routeAbs, filepath, pages } = graphValue;
              const hasNestedPages = Object.keys(pages).length > 0;
              route(routeAbs, filepath, { index: true });
              if (hasNestedPages) {
                createRouteFromGraph(pages);
              }
            }
          }
          route(
            "/",
            path3.resolve(__vite_injected_original_dirname, "./app/routes/_layout.tsx"),
            () => {
              createRouteFromGraph(butteryDocsGraph);
            }
          );
        });
        return routes;
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidGFyZ2V0cy9yZW1peC9jbG91ZGZsYXJlLXBhZ2VzL3ZpdGUuY29uZmlnLnRzIiwgImNvbW1hbmRzL191dGlscy91dGlsLmdldEJ1dHRlcnlEb2NzQ29uZmlnLnRzIiwgImNvbW1hbmRzL191dGlscy91dGlsLmdldEJ1dHRlcnlEb2NzRGlyZWN0b3JpZXMudHMiLCAiY29tbWFuZHMvX3V0aWxzL3V0aWwuZ2V0QnV0dGVyeURvY3NHcmFwaC50cyIsICJjb21tYW5kcy9fdXRpbHMvdXRpbC5nZXRSb3V0ZVBhdGgudHMiLCAiY29tbWFuZHMvX3V0aWxzL3V0aWwubG9nZ2VyLnRzIiwgImNvbW1hbmRzL191dGlscy91dGlsLmZpbGUucGFyc2VGaWxlbmFtZS50cyIsICJjb21tYW5kcy9fdXRpbHMvdXRpbC5tZHgub3JkZXJNZHhGaWxlcy50cyIsICJjb21tYW5kcy9fdXRpbHMvdXRpbC5nZXRCdXR0ZXJ5RG9jc0dyYXBoVmFsdWVNZXRhLnRzIiwgImNvbW1hbmRzL191dGlscy91dGlsLmdldEJ1dHRlcnlEb2NzR3JhcGhWYWx1ZVNlY3Rpb25BbmRTZWdtZW50cy50cyIsICJjb21tYW5kcy9fdXRpbHMvdXRpbC5nZXRCdXR0ZXJ5RG9jc0dyYXBoVmFsdWVUT0MudHMiLCAiY29tbWFuZHMvX3V0aWxzL3V0aWwubWR4LmdldE1keEZpbGVDb250ZW50LnRzIiwgImNvbW1hbmRzL191dGlscy91dGlsLm1leC5wYXJzZU1keEZpbGUudHMiLCAiY29tbWFuZHMvX3V0aWxzL3ZpdGUtcGx1Z2luLXRyYW5zZm9ybS1tYXJrZG93bi1hc3NldC1wYXRoLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktZG9jcy90YXJnZXRzL3JlbWl4L2Nsb3VkZmxhcmUtcGFnZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LWRvY3MvdGFyZ2V0cy9yZW1peC9jbG91ZGZsYXJlLXBhZ2VzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LWRvY3MvdGFyZ2V0cy9yZW1peC9jbG91ZGZsYXJlLXBhZ2VzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IG1keCBmcm9tIFwiQG1keC1qcy9yb2xsdXBcIjtcbi8qKlxuICogTk9URTogVGhpcyBpcyBvbmx5IGhlcmUgdG8gZW5zdXJlIHRoYXQgdGhlIHJlbWl4XG4gKiBmdW5jdGlvbnMgZG9uJ3QgYm9tYiBvdXQgd2hlbiBydW5uaW5nIGRldmVsb3AuIFJlbWl4IHJlcXVpcmVzXG4gKiB0aGF0IHRoZXJlIGJlIGEgdml0ZSBjb25maWcgYXQgdGhlIHJvb3Qgb2YgdGhlIHByb2plY3QsIGhvd2V2ZXJcbiAqIHdlJ3JlIGludm9raW5nIHRoZSBgdml0ZS5jcmVhdGVTZXJ2ZXJgIGZ1bmN0aW9uIHVzaW5nIG5vZGUgb3V0c2lkZVxuICogdGhlIGJvdW5kcyBvZiB0aGUgcmVtaXggQ0xJLi4uIHRoZXJlZm9yZSB3ZSBjYW4ganVzdCBhZGQgdGhpcyBoZXJlIHRvIGVuc3VyZVxuICogdGhhdCB0aGUgcmVtaXggdml0ZSBwbHVnaW4gcGFzc2VzIHRoZSBjaGVja3MuIFRoZSB2aXRlIGFwcCB3aWxsIGluc3RlYWRcbiAqIHJ1biBvbiB0aGVcbiAqL1xuaW1wb3J0IHtcbiAgdml0ZVBsdWdpbiBhcyByZW1peCxcbiAgY2xvdWRmbGFyZURldlByb3h5Vml0ZVBsdWdpbiBhcyByZW1peENsb3VkZmxhcmVEZXZQcm94eSxcbn0gZnJvbSBcIkByZW1peC1ydW4vZGV2XCI7XG5pbXBvcnQgcmVoeXBlU2hpa2kgZnJvbSBcIkBzaGlraWpzL3JlaHlwZVwiO1xuaW1wb3J0IHd5dyBmcm9tIFwiQHd5dy1pbi1qcy92aXRlXCI7XG5pbXBvcnQgY2hva2lkYXIgZnJvbSBcImNob2tpZGFyXCI7XG5pbXBvcnQgcmVoeXBlQXV0b2xpbmtIZWFkaW5ncyBmcm9tIFwicmVoeXBlLWF1dG9saW5rLWhlYWRpbmdzXCI7XG5pbXBvcnQgcmVoeXBlU2x1ZyBmcm9tIFwicmVoeXBlLXNsdWdcIjtcbmltcG9ydCByZW1hcmtGcm9udG1hdHRlciBmcm9tIFwicmVtYXJrLWZyb250bWF0dGVyXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHR5cGUgeyBCdXR0ZXJ5RG9jc0dyYXBoIH0gZnJvbSBcIi4uLy4uLy4uL2NvbW1hbmRzL191dGlscy90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0QnV0dGVyeURvY3NDb25maWcgfSBmcm9tIFwiLi4vLi4vLi4vY29tbWFuZHMvX3V0aWxzL3V0aWwuZ2V0QnV0dGVyeURvY3NDb25maWdcIjtcbmltcG9ydCB7IGdldEJ1dHRlcnlEb2NzRGlyZWN0b3JpZXMgfSBmcm9tIFwiLi4vLi4vLi4vY29tbWFuZHMvX3V0aWxzL3V0aWwuZ2V0QnV0dGVyeURvY3NEaXJlY3Rvcmllc1wiO1xuaW1wb3J0IHsgZ2V0QnV0dGVyeURvY3NHcmFwaCB9IGZyb20gXCIuLi8uLi8uLi9jb21tYW5kcy9fdXRpbHMvdXRpbC5nZXRCdXR0ZXJ5RG9jc0dyYXBoXCI7XG5pbXBvcnQgeyBMT0dfRE9DUyB9IGZyb20gXCIuLi8uLi8uLi9jb21tYW5kcy9fdXRpbHMvdXRpbC5sb2dnZXJcIjtcbmltcG9ydCB7IHRyYW5zZm9ybU1hcmtkb3duQXNzZXRQYXRoIH0gZnJvbSBcIi4uLy4uLy4uL2NvbW1hbmRzL191dGlscy92aXRlLXBsdWdpbi10cmFuc2Zvcm0tbWFya2Rvd24tYXNzZXQtcGF0aFwiO1xuXG5jb25zdCBidXR0ZXJ5RG9jc0NvbmZpZyA9IGF3YWl0IGdldEJ1dHRlcnlEb2NzQ29uZmlnKCk7XG5jb25zdCBidXR0ZXJ5RG9jc0RpcmVjdG9yaWVzID0gZ2V0QnV0dGVyeURvY3NEaXJlY3RvcmllcyhidXR0ZXJ5RG9jc0NvbmZpZyk7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByb290OiBpbXBvcnQubWV0YS5kaXJuYW1lLFxuICBwdWJsaWNEaXI6IGJ1dHRlcnlEb2NzRGlyZWN0b3JpZXMucHVibGljLFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAxMzQ3LFxuICAgIGhtcjoge1xuICAgICAgcG9ydDogNDQzLFxuICAgIH0sXG4gICAgZnM6IHtcbiAgICAgIHN0cmljdDogZmFsc2UsXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiY3VzdG9tLXdhdGNoZXJcIixcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgICAgY29uc3QgY3VzdG9tV2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKGJ1dHRlcnlEb2NzRGlyZWN0b3JpZXMuZG9jcyk7XG4gICAgICAgIExPR19ET0NTLndhdGNoKFxuICAgICAgICAgIGBMaXN0ZW5pbmcgZm9yIGNoYW5nZXMgdG8gZmlsZXMgaW46ICcke2J1dHRlcnlEb2NzRGlyZWN0b3JpZXMuZG9jc30nYFxuICAgICAgICApO1xuXG4gICAgICAgIGN1c3RvbVdhdGNoZXIub24oXCJjaGFuZ2VcIiwgKHBhdGgpID0+IHtcbiAgICAgICAgICBMT0dfRE9DUy5pbmZvKGBcIiR7cGF0aH1cIiBoYXMgY2hhbmdlZC4uLiByZWxvYWRpbmcuYCk7XG4gICAgICAgICAgc2VydmVyLndzLnNlbmQoe1xuICAgICAgICAgICAgdHlwZTogXCJmdWxsLXJlbG9hZFwiLFxuICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgdHJhbnNmb3JtTWFya2Rvd25Bc3NldFBhdGgoKSxcbiAgICBtZHgoe1xuICAgICAgcmVtYXJrUGx1Z2luczogW3JlbWFya0Zyb250bWF0dGVyXSxcbiAgICAgIHJlaHlwZVBsdWdpbnM6IFtcbiAgICAgICAgcmVoeXBlU2x1ZyxcbiAgICAgICAgW1xuICAgICAgICAgIHJlaHlwZUF1dG9saW5rSGVhZGluZ3MsXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVoYXZpb3I6IFwid3JhcFwiLFxuICAgICAgICAgICAgaGVhZGluZ1Byb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImhlYWRpbmdcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgW1xuICAgICAgICAgIHJlaHlwZVNoaWtpLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRoZW1lOiBcImRhcmstcGx1c1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICBdLFxuICAgIH0pLFxuICAgIHd5dyh7XG4gICAgICBpbmNsdWRlOiBcIi8qKi8qLih0c3x0c3gpXCIsXG4gICAgICBiYWJlbE9wdGlvbnM6IHtcbiAgICAgICAgcHJlc2V0czogW1wiQGJhYmVsL3ByZXNldC10eXBlc2NyaXB0XCIsIFwiQGJhYmVsL3ByZXNldC1yZWFjdFwiXSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgcmVtaXhDbG91ZGZsYXJlRGV2UHJveHkoKSxcbiAgICByZW1peCh7XG4gICAgICBhcHBEaXJlY3Rvcnk6IHBhdGgucmVzb2x2ZShpbXBvcnQubWV0YS5kaXJuYW1lLCBcIi4vYXBwXCIpLFxuICAgICAgYXN5bmMgcm91dGVzKGRlZmluZVJvdXRlcykge1xuICAgICAgICBjb25zdCBidXR0ZXJ5RG9jc0dyYXBoID0gYXdhaXQgZ2V0QnV0dGVyeURvY3NHcmFwaChidXR0ZXJ5RG9jc0NvbmZpZyk7XG5cbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoYnV0dGVyeURvY3NHcmFwaCwgbnVsbCwgMikpO1xuXG4gICAgICAgIGNvbnN0IHJvdXRlcyA9IGRlZmluZVJvdXRlcygocm91dGUpID0+IHtcbiAgICAgICAgICBmdW5jdGlvbiBjcmVhdGVSb3V0ZUZyb21HcmFwaChncmFwaDogQnV0dGVyeURvY3NHcmFwaCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBncmFwaFZhbHVlIG9mIE9iamVjdC52YWx1ZXMoZ3JhcGgpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHsgcm91dGVBYnMsIGZpbGVwYXRoLCBwYWdlcyB9ID0gZ3JhcGhWYWx1ZTtcbiAgICAgICAgICAgICAgY29uc3QgaGFzTmVzdGVkUGFnZXMgPSBPYmplY3Qua2V5cyhwYWdlcykubGVuZ3RoID4gMDtcblxuICAgICAgICAgICAgICAvLyBlc2NhcGUgdGhlIGluZGV4IHBhZ2VcbiAgICAgICAgICAgICAgLy8gaWYgKHJvdXRlQWJzID09PSBcIi9cIikgY29udGludWU7XG5cbiAgICAgICAgICAgICAgcm91dGUocm91dGVBYnMsIGZpbGVwYXRoLCB7IGluZGV4OiB0cnVlIH0pO1xuXG4gICAgICAgICAgICAgIGlmIChoYXNOZXN0ZWRQYWdlcykge1xuICAgICAgICAgICAgICAgIC8vIHJlY3Vyc2VcbiAgICAgICAgICAgICAgICBjcmVhdGVSb3V0ZUZyb21HcmFwaChwYWdlcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcm91dGUoXG4gICAgICAgICAgICBcIi9cIixcbiAgICAgICAgICAgIHBhdGgucmVzb2x2ZShpbXBvcnQubWV0YS5kaXJuYW1lLCBcIi4vYXBwL3JvdXRlcy9fbGF5b3V0LnRzeFwiKSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgY3JlYXRlUm91dGVGcm9tR3JhcGgoYnV0dGVyeURvY3NHcmFwaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFRPRE86IHB1dCBiZWhpbmQgYSB2ZXJib3NlIGxvZ1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhyb3V0ZXMpO1xuICAgICAgICByZXR1cm4gcm91dGVzO1xuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbn0pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktZG9jcy9jb21tYW5kcy9fdXRpbHMvdXRpbC5nZXRCdXR0ZXJ5RG9jc0NvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlscy91dGlsLmdldEJ1dHRlcnlEb2NzQ29uZmlnLnRzXCI7aW1wb3J0IHsgZ2V0QnV0dGVyeUNvbmZpZyB9IGZyb20gXCJAYnV0dGVyeS9jb3JlXCI7XG5cbmV4cG9ydCB0eXBlIEJ1dHRlcnlEb2NzQ29uZmlnID0gQXdhaXRlZDxcbiAgUmV0dXJuVHlwZTx0eXBlb2YgZ2V0QnV0dGVyeURvY3NDb25maWc+XG4+O1xuXG4vKipcbiAqIEZldGNoZXMgdGhlIGJ1dHRlcnkuZG9jcyBjb25maWcgZnJvbSB0aGVcbiAqIGBidXR0ZXJ5LmNvbmZpZy50c2AgZmlsZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QnV0dGVyeURvY3NDb25maWcoKSB7XG4gIHJldHVybiBhd2FpdCBnZXRCdXR0ZXJ5Q29uZmlnKFwiZG9jc1wiKTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktZG9jcy9jb21tYW5kcy9fdXRpbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LWRvY3MvY29tbWFuZHMvX3V0aWxzL3V0aWwuZ2V0QnV0dGVyeURvY3NEaXJlY3Rvcmllcy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlscy91dGlsLmdldEJ1dHRlcnlEb2NzRGlyZWN0b3JpZXMudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG5pbXBvcnQgdHlwZSB7IEJ1dHRlcnlEb2NzQ29uZmlnIH0gZnJvbSBcIi4vdXRpbC5nZXRCdXR0ZXJ5RG9jc0NvbmZpZ1wiO1xuXG4vKipcbiAqIFJldHVybnMgc29tZSBhYnNvbHV0ZSBwYXRoIGRpcmVjdG9yaWVzIGZvciBlYXNpbHkgcmVmZXJlbmNpbmcgZGlyZWN0b3JpZXNcbiAqIHRoYXQgd2Ugc2hvdWxkIGJlIHB1bGxpbmcgZmlsZXMgZnJvbSBvciBzZXJ2aW5nIGNvbnRlbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRCdXR0ZXJ5RG9jc0RpcmVjdG9yaWVzKGNvbmZpZzogQnV0dGVyeURvY3NDb25maWcpIHtcbiAgcmV0dXJuIHtcbiAgICBkb2NzOiBwYXRoLnJlc29sdmUoY29uZmlnLmNvbmZpZ0Jhc2Uucm9vdCwgXCIuL2RvY3NcIiksXG4gICAgcHVibGljOiBwYXRoLnJlc29sdmUoY29uZmlnLmNvbmZpZ0Jhc2Uucm9vdCwgXCIuL2RvY3MvcHVibGljXCIpLFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktZG9jcy9jb21tYW5kcy9fdXRpbHMvdXRpbC5nZXRCdXR0ZXJ5RG9jc0dyYXBoLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LWRvY3MvY29tbWFuZHMvX3V0aWxzL3V0aWwuZ2V0QnV0dGVyeURvY3NHcmFwaC50c1wiO2ltcG9ydCB7IHJlYWRkaXIgfSBmcm9tIFwibm9kZTpmcy9wcm9taXNlc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IHR5cGUgeyBCdXR0ZXJ5Q29uZmlnRG9jcyB9IGZyb20gXCJAYnV0dGVyeS9jb3JlXCI7XG5pbXBvcnQgdHlwZSB7IEJ1dHRlcnlEb2NzR3JhcGggfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBCdXR0ZXJ5RG9jc0NvbmZpZyB9IGZyb20gXCIuL3V0aWwuZ2V0QnV0dGVyeURvY3NDb25maWdcIjtcbmltcG9ydCB7IGdldEJ1dHRlcnlEb2NzRGlyZWN0b3JpZXMgfSBmcm9tIFwiLi91dGlsLmdldEJ1dHRlcnlEb2NzRGlyZWN0b3JpZXNcIjtcbmltcG9ydCB7IGdldFJvdXRlUGF0aCB9IGZyb20gXCIuL3V0aWwuZ2V0Um91dGVQYXRoXCI7XG5pbXBvcnQgeyBMT0dfRE9DUyB9IGZyb20gXCIuL3V0aWwubG9nZ2VyXCI7XG5pbXBvcnQgeyBvcmRlckZpbGVzIH0gZnJvbSBcIi4vdXRpbC5tZHgub3JkZXJNZHhGaWxlc1wiO1xuaW1wb3J0IHsgcGFyc2VNZHhGaWxlIH0gZnJvbSBcIi4vdXRpbC5tZXgucGFyc2VNZHhGaWxlXCI7XG5pbXBvcnQgdHlwZSB7IEZpbGVPYmogfSBmcm9tIFwiLi91dGlsLnR5cGVzXCI7XG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gZmV0Y2hlcyBhbGwgb2YgdGhlIGZpbGVzIGluIHRoZSB1c2VyXG4gKiBkZWZpbmVkIGRvY3MgZGlyZWN0b3J5LCBpdGVyYXRlcyBvdmVyIHRoZW0gYW5kXG4gKiByZWN1cnNpdmVseSBjcmVhdGVzIGEgZ3JhcGggLyB0cmVlIHJlcHJlc2VudGF0aW9uXG4gKiBvZiB0aGUgZG9jcyB0aGF0IGFyZSBuZWVkZWQgZm9yIHRoZSBjb21wb25lbnRzXG4gKiB0byBwcm9wZXJseSBkaXNwbGF5LlxuICpcbiAqIFRPRE86IG5lZWQgdG8gd3JpdGUgYSB0ZXN0IGZvciB0aGlzXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVHcmFwaCA9IGFzeW5jICh7XG4gIGZpbGVzLFxuICBkb2NzQ29uZmlnLFxufToge1xuICBmaWxlczogRmlsZU9ialtdO1xuICBkb2NzQ29uZmlnOiBCdXR0ZXJ5Q29uZmlnRG9jcztcbn0pOiBQcm9taXNlPEJ1dHRlcnlEb2NzR3JhcGg+ID0+IHtcbiAgTE9HX0RPQ1MuZGVidWcoXCJHZW5lcmF0aW5nIGdyYXBoIHJlcHJlc2VudGF0aW9uIG9mIGRvY3MuLi5cIik7XG4gIGNvbnN0IGdyYXBoOiBCdXR0ZXJ5RG9jc0dyYXBoID0ge307XG5cbiAgYXN5bmMgZnVuY3Rpb24gaW5zZXJ0Tm9kZShmaWxlOiBGaWxlT2JqKSB7XG4gICAgY29uc3QgcGFyc2VkRmlsZSA9IGF3YWl0IHBhcnNlTWR4RmlsZShmaWxlKTtcbiAgICBpZiAoIXBhcnNlZEZpbGUpIHJldHVybjtcbiAgICBjb25zdCB7XG4gICAgICBtZXRhOiB7IHRpdGxlIH0sXG4gICAgICBzZWN0aW9uLFxuICAgICAgc2VnbWVudHMsXG4gICAgICAvLyBjb250ZW50LFxuICAgICAgcm91dGVBYnMsXG4gICAgICB0b2MsXG4gICAgfSA9IHBhcnNlZEZpbGU7XG5cbiAgICBjb25zdCBzZWN0aW9uVGl0bGUgPVxuICAgICAgZG9jc0NvbmZpZz8ub3JkZXI/LltzZWN0aW9uXT8uZGlzcGxheSA/PyBzZWN0aW9uLnJlcGxhY2UoLy0vZywgXCIgXCIpO1xuXG4gICAgaWYgKHNlY3Rpb24gJiYgIWdyYXBoW3NlY3Rpb25dKSB7XG4gICAgICBncmFwaFtzZWN0aW9uXSA9IHtcbiAgICAgICAgdGl0bGU6IHNlY3Rpb25UaXRsZSxcbiAgICAgICAgZmlsZXBhdGg6IGZpbGUuZnNQYXRoLFxuICAgICAgICByb3V0ZUFiczogYC8ke3NlY3Rpb24gPT09IFwiX2luZGV4XCIgPyBcIlwiIDogc2VjdGlvbn1gLFxuICAgICAgICByb3V0ZVJlbDogc2VjdGlvbiA9PT0gXCJfaW5kZXhcIiA/IFwiL1wiIDogc2VjdGlvbixcbiAgICAgICAgdG9jOiBbXSxcbiAgICAgICAgcGFnZXM6IHt9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBzZXQgdGhlIGdyYXBoIHRvIHRoZSBjdXJyZW50IGdyYXBoLlxuICAgIC8vIGpzIHdvcmtzIHdpdGggcmVmZXJlbmNlcyB0byB0aGUgZ3JhcGggaXMganVzdFxuICAgIC8vIG5vdyBhIHJlZmVyZW5jZSB0byBjdXJyZW50IGdyYXBoIHdoaWNoIHdlIHJlY3Vyc2l2ZWx5XG4gICAgLy8gdXBkYXRlIGlmIG5lZWQgaXRcbiAgICBsZXQgY3VycmVudEdyYXBoID0gc2VjdGlvbiA/IGdyYXBoW3NlY3Rpb25dLnBhZ2VzIDogZ3JhcGg7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnRJbmRleCBpbiBzZWdtZW50cykge1xuICAgICAgY29uc3QgaSA9IE51bWJlcihzZWdtZW50SW5kZXgpO1xuICAgICAgY29uc3Qgc2VnbWVudCA9IHNlZ21lbnRzW2ldO1xuICAgICAgaWYgKCFjdXJyZW50R3JhcGhbc2VnbWVudF0pIHtcbiAgICAgICAgY3VycmVudEdyYXBoW3NlZ21lbnRdID0ge1xuICAgICAgICAgIHRpdGxlOiBcIlwiLFxuICAgICAgICAgIGZpbGVwYXRoOiBcIlwiLFxuICAgICAgICAgIHJvdXRlQWJzOiBcIlwiLFxuICAgICAgICAgIHJvdXRlUmVsOiBcIlwiLFxuICAgICAgICAgIHRvYzogW10sXG4gICAgICAgICAgcGFnZXM6IHt9LFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaSA9PT0gc2VnbWVudHMubGVuZ3RoIC0gMSkge1xuICAgICAgICBjdXJyZW50R3JhcGhbc2VnbWVudF0udGl0bGUgPSB0aXRsZTtcbiAgICAgICAgY3VycmVudEdyYXBoW3NlZ21lbnRdLmZpbGVwYXRoID0gZmlsZS5mc1BhdGg7XG4gICAgICAgIGN1cnJlbnRHcmFwaFtzZWdtZW50XS5yb3V0ZUFicyA9IHJvdXRlQWJzO1xuICAgICAgICBjdXJyZW50R3JhcGhbc2VnbWVudF0ucm91dGVSZWwgPSBzZWdtZW50O1xuICAgICAgICBjdXJyZW50R3JhcGhbc2VnbWVudF0udG9jID0gdG9jO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudEdyYXBoID0gY3VycmVudEdyYXBoW3NlZ21lbnRdLnBhZ2VzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGZvciBlYWNoIGZpbGUgZmluZCBhIHBsYWNlIGZvciBpdCBpbiB0aGUgZ3JhcGhcbiAgZm9yIChjb25zdCBmaWxlSW5kZXggaW4gZmlsZXMpIHtcbiAgICBjb25zdCBmaWxlID0gZmlsZXNbZmlsZUluZGV4XTtcbiAgICBhd2FpdCBpbnNlcnROb2RlKGZpbGUpO1xuICB9XG5cbiAgTE9HX0RPQ1MuZGVidWcoXCJHZW5lcmF0aW5nIGdyYXBoIHJlcHJlc2VudGF0aW9uIG9mIGRvY3MuLi4gZG9uZS5cIik7XG4gIHJldHVybiBncmFwaDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGdyYXBoL29iamVjdCByZXByZXNlbnRhdGlvbiBvZiB0aGUgdGhlIGZpbGVzXG4gKiBjb250YWluZWQgaW5zaWRlIG9mIHRoZSBkb2NzIGRpcmVjdG9yeSB0aGF0IGlzIHJlZmVyZW5jZWRcbiAqIGluIHRoZSBgYnV0dGVyeS5jb25maWcudHNgIGZpbGUuIFRoaXMgZ3JhcGggaXMgYSByZWN1cnNpdmUgcmVwcmVzZW50YXRpb25cbiAqIG9mIHRoZSBmaWxlcyBhbmQgY2FuIHRoZW4gYmUgcmVjdXJzZWQgdGhyb3VnaCB0byBidWlsZCByb3V0ZXMsIG5hdmlnYXRpb25hbFxuICogaXRlbXMsIGV0Yy4uLiBUaGluayBvZiBpdCBsaWtlIGFuIEFTVCBidXQgb25seSBmb3IgdGhlIGRvY3MgdGhhdCBhcmUgZGVmaW5lZFxuICogaW4gdGhlIGZvbGRlciB0aGF0IHRoZSB1c2VyIHNwZWNpZmllZCBpbiB0aGVpciBgYnV0dGVyeS5jb25maWcudHNgLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QnV0dGVyeURvY3NHcmFwaChjb25maWc6IEJ1dHRlcnlEb2NzQ29uZmlnKSB7XG4gIGNvbnN0IGRvY3NEaXJlY3RvcmllcyA9IGdldEJ1dHRlcnlEb2NzRGlyZWN0b3JpZXMoY29uZmlnKTtcblxuICAvLyBnZXQgdGhlIGZpbGVzIGluc2lkZSBvZiB0aGUgZG9jcyBkaXJlY3RvcnlcbiAgLy8gYW5kIGVucmljaCB0aGVtIHdpdGggc29tZSBvZiB0aGUgZGF0YVxuICBjb25zdCBkb2NzRGlyQ29udGVudHMgPSBhd2FpdCByZWFkZGlyKGRvY3NEaXJlY3Rvcmllcy5kb2NzLCB7XG4gICAgcmVjdXJzaXZlOiBmYWxzZSxcbiAgICB3aXRoRmlsZVR5cGVzOiB0cnVlLFxuICB9KTtcbiAgY29uc3QgZG9jc0RpckZpbGVzID0gZG9jc0RpckNvbnRlbnRzLnJlZHVjZTxcbiAgICB7XG4gICAgICBmc1BhdGg6IHN0cmluZztcbiAgICAgIGZpbGVuYW1lOiBzdHJpbmc7XG4gICAgICByb3V0ZVBhdGg6IHN0cmluZztcbiAgICB9W11cbiAgPigoYWNjdW0sIGRpcmVudCkgPT4ge1xuICAgIGNvbnN0IGlzRmlsZSA9IGRpcmVudC5pc0ZpbGUoKTtcbiAgICBpZiAoIWlzRmlsZSkgcmV0dXJuIGFjY3VtO1xuICAgIGNvbnN0IGZzUGF0aCA9IGRpcmVudC5wYXJlbnRQYXRoLmNvbmNhdChcIi9cIikuY29uY2F0KGRpcmVudC5uYW1lKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IHBhdGgucGFyc2UoZGlyZW50Lm5hbWUpLm5hbWU7XG4gICAgY29uc3Qgcm91dGVQYXRoID0gZ2V0Um91dGVQYXRoKGZpbGVuYW1lKTtcblxuICAgIHJldHVybiBhY2N1bS5jb25jYXQoe1xuICAgICAgZnNQYXRoLFxuICAgICAgZmlsZW5hbWUsXG4gICAgICByb3V0ZVBhdGgsXG4gICAgfSk7XG4gIH0sIFtdKTtcblxuICAvLyBvcmRlciB0aGUgZmlsZXNcbiAgY29uc3QgZmlsZXMgPSBvcmRlckZpbGVzKHtcbiAgICBkb2NzQ29uZmlnOiBjb25maWcuZG9jcyxcbiAgICBmaWxlczogZG9jc0RpckZpbGVzLFxuICB9KTtcblxuICAvLyBjcmVhdGUgdGhlIGdyYXBoXG4gIGNvbnN0IGRvY3NHcmFwaCA9IGF3YWl0IGNyZWF0ZUdyYXBoKHtcbiAgICBkb2NzQ29uZmlnOiBjb25maWcuZG9jcyxcbiAgICBmaWxlcyxcbiAgfSk7XG4gIHJldHVybiBkb2NzR3JhcGg7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LWRvY3MvY29tbWFuZHMvX3V0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlscy91dGlsLmdldFJvdXRlUGF0aC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlscy91dGlsLmdldFJvdXRlUGF0aC50c1wiO2V4cG9ydCBmdW5jdGlvbiBnZXRSb3V0ZVBhdGgoZmlsZW5hbWU6IHN0cmluZykge1xuICAvLyBUT0RPOiBOZWVkcyBtb3JlIHNjZW5hcmlvcyBhbmQgdGVzdGluZ1xuICBpZiAoZmlsZW5hbWUgPT09IFwiX2luZGV4XCIpIHtcbiAgICByZXR1cm4gXCIvXCI7XG4gIH1cbiAgcmV0dXJuIFwiL1wiLmNvbmNhdChmaWxlbmFtZS5zcGxpdChcIi5cIikuam9pbihcIi9cIikpO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktZG9jcy9jb21tYW5kcy9fdXRpbHMvdXRpbC5sb2dnZXIudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktZG9jcy9jb21tYW5kcy9fdXRpbHMvdXRpbC5sb2dnZXIudHNcIjtpbXBvcnQgeyBCdXR0ZXJ5TG9nZ2VyIH0gZnJvbSBcIkBidXR0ZXJ5L2xvZ2dlclwiO1xuXG5leHBvcnQgY29uc3QgTE9HX0RPQ1MgPSBuZXcgQnV0dGVyeUxvZ2dlcih7XG4gIHByZWZpeDogXCJAYnV0dGVyeS9kb2NzXCIsXG4gIHNob3VsZFByaW50TGV2ZWw6IGZhbHNlLFxuICBmb3JtYXQ6IFwiYmFzaWNcIlxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LWRvY3MvY29tbWFuZHMvX3V0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlscy91dGlsLmZpbGUucGFyc2VGaWxlbmFtZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlscy91dGlsLmZpbGUucGFyc2VGaWxlbmFtZS50c1wiO2V4cG9ydCBjb25zdCBwYXJzZUZpbGVuYW1lID0gKGZpbGVuYW1lOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBzZWN0aW9uOiBmaWxlbmFtZS5zcGxpdChcIi5cIilbMF0sXG4gIH07XG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktZG9jcy9jb21tYW5kcy9fdXRpbHMvdXRpbC5tZHgub3JkZXJNZHhGaWxlcy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlscy91dGlsLm1keC5vcmRlck1keEZpbGVzLnRzXCI7aW1wb3J0IHR5cGUgeyBCdXR0ZXJ5Q29uZmlnRG9jcywgQnV0dGVyeUNvbmZpZ0RvY3NPcmRlciB9IGZyb20gXCJAYnV0dGVyeS9jb3JlXCI7XG5pbXBvcnQgeyBwYXJzZUZpbGVuYW1lIH0gZnJvbSBcIi4vdXRpbC5maWxlLnBhcnNlRmlsZW5hbWVcIjtcbmltcG9ydCB7IExPR19ET0NTIH0gZnJvbSBcIi4vdXRpbC5sb2dnZXJcIjtcbmltcG9ydCB0eXBlIHsgRmlsZU9iaiB9IGZyb20gXCIuL3V0aWwudHlwZXNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIG9yZGVyRmlsZXMoe1xuICBkb2NzQ29uZmlnOiB7IG9yZGVyIH0sXG4gIGZpbGVzLFxufToge1xuICBkb2NzQ29uZmlnOiBCdXR0ZXJ5Q29uZmlnRG9jcztcbiAgZmlsZXM6IEZpbGVPYmpbXTtcbn0pOiBGaWxlT2JqW10ge1xuICBsZXQgcmVjb25jaWxlZE9yZGVyID0gb3JkZXI7XG5cbiAgaWYgKCFvcmRlcikge1xuICAgIExPR19ET0NTLndhcm5pbmcoXG4gICAgICBcIk5vIGN1c3RvbSBvcmRlciBkZWZpbmVkLi4uIGdyb3VwaW5nIGZpbGVzIGJhc2VkIHVwb24gc2VjdGlvblwiXG4gICAgKTtcblxuICAgIHJlY29uY2lsZWRPcmRlciA9IGZpbGVzLnJlZHVjZTxCdXR0ZXJ5Q29uZmlnRG9jc09yZGVyPigoYWNjdW0sIGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IHsgc2VjdGlvbiB9ID0gcGFyc2VGaWxlbmFtZShmaWxlLmZpbGVuYW1lKTtcbiAgICAgIGNvbnNvbGUubG9nKHNlY3Rpb24pO1xuXG4gICAgICByZXR1cm4gYWNjdW07XG4gICAgfSwge30pO1xuICAgIHJldHVybiBmaWxlcztcbiAgfVxuXG4gIGNvbnN0IG9GaWxlczogRmlsZU9ialtdID0gW107XG5cbiAgLy8gbG9vcCB0aHJvdWdoIHRocm91Z2ggdGhlIGRvY3Mub3JkZXIgY29uZmlndXJhdGlvbiBwcm9wZXJ0eVxuICBmb3IgKGNvbnN0IHNlY3Rpb24gaW4gb3JkZXIpIHtcbiAgICBjb25zdCBzZWN0aW9uT3JkZXIgPSBvcmRlcltzZWN0aW9uXS5yb3V0ZU9yZGVyO1xuICAgIGZvciAoY29uc3Qgc2VjdGlvblJvdXRlIG9mIHNlY3Rpb25PcmRlcikge1xuICAgICAgLy8gYWRkIHRoZSBzZWN0aW9uIGluZGV4IGZpbGUgZmlyc3RcbiAgICAgIGNvbnN0IHNlY3Rpb25JbmRleEZpbGUgPSBmaWxlcy5maW5kKChmaWxlKSA9PiBmaWxlLmZpbGVuYW1lID09PSBzZWN0aW9uKTtcbiAgICAgIGNvbnN0IG9GaWxlc0hhc1NlY3Rpb25JbmRleEZpbGUgPSBvRmlsZXMuZmluZChcbiAgICAgICAgKGYpID0+IGYuZmlsZW5hbWUgPT09IHNlY3Rpb25JbmRleEZpbGU/LmZpbGVuYW1lXG4gICAgICApO1xuICAgICAgaWYgKCFvRmlsZXNIYXNTZWN0aW9uSW5kZXhGaWxlICYmIHNlY3Rpb25JbmRleEZpbGUpIHtcbiAgICAgICAgb0ZpbGVzLnB1c2goc2VjdGlvbkluZGV4RmlsZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCB0aGUgb3JkZXJlZCBmaWxlIG5hbWUgc2Vjb25kXG4gICAgICBjb25zdCBvcmRlcmVkRmlsZSA9IGZpbGVzLmZpbmQoXG4gICAgICAgIChmaWxlKSA9PiBmaWxlLmZpbGVuYW1lID09PSBgJHtzZWN0aW9ufS4ke3NlY3Rpb25Sb3V0ZX1gXG4gICAgICApO1xuICAgICAgaWYgKG9yZGVyZWRGaWxlKSBvRmlsZXMucHVzaChvcmRlcmVkRmlsZSk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgY29uc3QgZmlsZUFscmVhZHlPcmRlcmVkID0gb0ZpbGVzLmZpbmQoXG4gICAgICAob0ZpbGUpID0+IG9GaWxlLmZpbGVuYW1lID09PSBmaWxlLmZpbGVuYW1lXG4gICAgKTtcbiAgICBpZiAoIWZpbGVBbHJlYWR5T3JkZXJlZCAmJiBmaWxlLmZpbGVuYW1lID09PSBcIl9pbmRleFwiKSB7XG4gICAgICAvLyBhZGQgdGhlIF9pbmRleCBmaWxlIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIG9yZGVyXG4gICAgICBvRmlsZXMudW5zaGlmdChmaWxlKTtcbiAgICB9IGVsc2UgaWYgKCFmaWxlQWxyZWFkeU9yZGVyZWQpIHtcbiAgICAgIC8vIGFkZCB0aGUgdW4gb3JkZXJlZCBmaWxlcyB0byB0aGUgZW5kIG9mIHRoZSBvcmRlclxuICAgICAgTE9HX0RPQ1Mud2FybmluZyhcbiAgICAgICAgYE5vIG9yZGVyIGRlZmluZWQgZm9yIFwiJHtmaWxlLmZpbGVuYW1lfVwiLiBPcmRlcmluZyBhcmJpdHJhcmlseS5gXG4gICAgICApO1xuICAgICAgb0ZpbGVzLnB1c2goZmlsZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvRmlsZXM7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LWRvY3MvY29tbWFuZHMvX3V0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlscy91dGlsLmdldEJ1dHRlcnlEb2NzR3JhcGhWYWx1ZU1ldGEudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktZG9jcy9jb21tYW5kcy9fdXRpbHMvdXRpbC5nZXRCdXR0ZXJ5RG9jc0dyYXBoVmFsdWVNZXRhLnRzXCI7aW1wb3J0IHsgTE9HX0RPQ1MgfSBmcm9tIFwiLi91dGlsLmxvZ2dlclwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QnV0dGVyeURvY3NHcmFwaFZhbHVlTWV0YSh7XG4gIGZyb250bWF0dGVyLFxuICBmaWxlbmFtZSxcbn06IHtcbiAgZnJvbnRtYXR0ZXI6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG4gIGZpbGVuYW1lOiBzdHJpbmc7XG59KSB7XG4gIC8vIGdldCB0aGUgZmlsZVxuICBpZiAoIWZyb250bWF0dGVyLnRpdGxlKSB7XG4gICAgTE9HX0RPQ1Mud2FybmluZyhcbiAgICAgIGBcIiR7ZmlsZW5hbWV9XCIgaXMgbWlzc2luZyBhIGZyb250bWF0dGVyIHRpdGxlLiBcIiR7ZmlsZW5hbWV9XCIgd2lsbCBiZSB1c2VkIHRlbXBvcmFyaWx5LiBQbGVhc2UgZW5zdXJlIHlvdSBhZGQgdGhlIHRpdGxlIHByb3BlcnR5IGluIHRoZSBkb2N1bWVudCdzIGZyb250bWF0dGVyLmBcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0aXRsZTogZnJvbnRtYXR0ZXI/LnRpdGxlID8/IFwiXCIsXG4gIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LWRvY3MvY29tbWFuZHMvX3V0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlscy91dGlsLmdldEJ1dHRlcnlEb2NzR3JhcGhWYWx1ZVNlY3Rpb25BbmRTZWdtZW50cy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlscy91dGlsLmdldEJ1dHRlcnlEb2NzR3JhcGhWYWx1ZVNlY3Rpb25BbmRTZWdtZW50cy50c1wiO2V4cG9ydCBjb25zdCBnZXRCdXR0ZXJ5RG9jc0dyYXBoVmFsdWVTZWN0aW9uQW5kU2VnbWVudHMgPSAoXG4gIGZpbGVOYW1lOiBzdHJpbmdcbik6IHsgc2VjdGlvbjogc3RyaW5nOyBzZWdtZW50czogc3RyaW5nW10gfSA9PiB7XG4gIGNvbnN0IGFsbFNlZ21lbnRzID0gZmlsZU5hbWUuc3BsaXQoXCIuXCIpO1xuICBjb25zdCBbc2VjdGlvbiwgLi4uc2VnbWVudHNdID0gYWxsU2VnbWVudHM7XG5cbiAgcmV0dXJuIHtcbiAgICBzZWN0aW9uLFxuICAgIHNlZ21lbnRzLFxuICB9O1xufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktZG9jcy9jb21tYW5kcy9fdXRpbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LWRvY3MvY29tbWFuZHMvX3V0aWxzL3V0aWwuZ2V0QnV0dGVyeURvY3NHcmFwaFZhbHVlVE9DLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LWRvY3MvY29tbWFuZHMvX3V0aWxzL3V0aWwuZ2V0QnV0dGVyeURvY3NHcmFwaFZhbHVlVE9DLnRzXCI7aW1wb3J0IHJlaHlwZVBhcnNlIGZyb20gXCJyZWh5cGUtcGFyc2VcIjtcbmltcG9ydCByZWh5cGVTbHVnIGZyb20gXCJyZWh5cGUtc2x1Z1wiO1xuaW1wb3J0IHJlaHlwZVN0cmluZ2lmeSBmcm9tIFwicmVoeXBlLXN0cmluZ2lmeVwiO1xuaW1wb3J0IHJlbWFya01keCBmcm9tIFwicmVtYXJrLW1keFwiO1xuaW1wb3J0IHJlbWFya1BhcnNlIGZyb20gXCJyZW1hcmstcGFyc2VcIjtcbmltcG9ydCByZW1hcmtSZWh5cGUgZnJvbSBcInJlbWFyay1yZWh5cGVcIjtcbmltcG9ydCB7IHVuaWZpZWQgfSBmcm9tIFwidW5pZmllZFwiO1xuaW1wb3J0IHsgdmlzaXQgfSBmcm9tIFwidW5pc3QtdXRpbC12aXNpdFwiO1xuaW1wb3J0IHR5cGUgeyBCdXR0ZXJ5RG9jc0dyYXBoVE9DIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJ1dHRlcnlEb2NzR3JhcGhWYWx1ZVRPQyhtYXJrZG93bkNvbnRlbnQ6IHN0cmluZykge1xuICBjb25zdCBmaWxlID0gdW5pZmllZCgpXG4gICAgLnVzZShyZW1hcmtQYXJzZSlcbiAgICAudXNlKHJlbWFya01keClcbiAgICAudXNlKHJlbWFya1JlaHlwZSlcbiAgICAudXNlKHJlaHlwZVNsdWcpXG4gICAgLnVzZShyZWh5cGVTdHJpbmdpZnkpXG4gICAgLnByb2Nlc3NTeW5jKG1hcmtkb3duQ29udGVudCk7XG4gIGNvbnN0IHRyZWUgPSB1bmlmaWVkKClcbiAgICAudXNlKHJlaHlwZVBhcnNlLCB7IGZyYWdtZW50OiB0cnVlIH0pXG4gICAgLnBhcnNlKGZpbGUudG9TdHJpbmcoKSk7XG5cbiAgY29uc3QgdG9jOiBCdXR0ZXJ5RG9jc0dyYXBoVE9DW10gPSBbXTtcbiAgY29uc3Qgc3RhY2s6IEJ1dHRlcnlEb2NzR3JhcGhUT0NbXSA9IFtdO1xuXG4gIC8vIGJpb21lLWlnbm9yZSBsaW50L3N1c3BpY2lvdXMvbm9FeHBsaWNpdEFueTogPGV4cGxhbmF0aW9uPlxuICB2aXNpdCh0cmVlLCBcImVsZW1lbnRcIiwgKG5vZGU6IGFueSkgPT4ge1xuICAgIGlmIChcbiAgICAgIG5vZGUudGFnTmFtZS5tYXRjaCgvXmhbMi02XSQvKSAmJlxuICAgICAgbm9kZS5wcm9wZXJ0aWVzICYmXG4gICAgICBub2RlLnByb3BlcnRpZXMuaWRcbiAgICApIHtcbiAgICAgIGNvbnN0IGxldmVsID0gTnVtYmVyLnBhcnNlSW50KG5vZGUudGFnTmFtZVsxXSwgMTApO1xuICAgICAgY29uc3QgdGl0bGUgPSBub2RlLmNoaWxkcmVuXG4gICAgICAgIC8vIGJpb21lLWlnbm9yZSBsaW50L3N1c3BpY2lvdXMvbm9FeHBsaWNpdEFueTogPGV4cGxhbmF0aW9uPlxuICAgICAgICAubWFwKChjaGlsZDogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09IFwidGV4dFwiKSByZXR1cm4gY2hpbGQudmFsdWU7XG4gICAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09IFwiaDFcIikgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY2hpbGQudHlwZSA9PT0gXCJlbGVtZW50XCIgJiZcbiAgICAgICAgICAgIChjaGlsZC50YWdOYW1lID09PSBcImFcIiB8fCBjaGlsZC50YWdOYW1lID09PSBcImNvZGVcIilcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIGJpb21lLWlnbm9yZSBsaW50L3N1c3BpY2lvdXMvbm9FeHBsaWNpdEFueTogPGV4cGxhbmF0aW9uPlxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLmNoaWxkcmVuLm1hcCgoYUNoaWxkOiBhbnkpID0+IGFDaGlsZC52YWx1ZSkuam9pbihcIlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH0pXG4gICAgICAgIC5qb2luKFwiXCIpO1xuICAgICAgY29uc3QgbGluayA9IGAjJHtub2RlLnByb3BlcnRpZXMuaWR9YDtcbiAgICAgIGNvbnN0IGhlYWRlckl0ZW06IEJ1dHRlcnlEb2NzR3JhcGhUT0MgPSB7XG4gICAgICAgIGxldmVsLFxuICAgICAgICB0aXRsZSxcbiAgICAgICAgbGluayxcbiAgICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgfTtcblxuICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCAmJiBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5sZXZlbCA+PSBsZXZlbCkge1xuICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YWNrLmxlbmd0aCkge1xuICAgICAgICBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5jaGlsZHJlbi5wdXNoKGhlYWRlckl0ZW0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9jLnB1c2goaGVhZGVySXRlbSk7XG4gICAgICB9XG5cbiAgICAgIHN0YWNrLnB1c2goaGVhZGVySXRlbSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdG9jO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktZG9jcy9jb21tYW5kcy9fdXRpbHMvdXRpbC5tZHguZ2V0TWR4RmlsZUNvbnRlbnQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktZG9jcy9jb21tYW5kcy9fdXRpbHMvdXRpbC5tZHguZ2V0TWR4RmlsZUNvbnRlbnQudHNcIjtpbXBvcnQgeyByZWFkRmlsZSB9IGZyb20gXCJub2RlOmZzL3Byb21pc2VzXCI7XG5pbXBvcnQgbWF0dGVyIGZyb20gXCJncmF5LW1hdHRlclwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TWR4RmlsZUNvbnRlbnQoZmlsZXBhdGg6IHN0cmluZykge1xuICBjb25zdCByYXdNZHhDb250ZW50ID0gYXdhaXQgcmVhZEZpbGUoZmlsZXBhdGgsIHsgZW5jb2Rpbmc6IFwidXRmOFwiIH0pO1xuXG4gIGNvbnN0IHsgZGF0YTogZnJvbnRtYXR0ZXIsIGNvbnRlbnQ6IG1keENvbnRlbnQgfSA9IG1hdHRlcihyYXdNZHhDb250ZW50KTtcbiAgcmV0dXJuIHtcbiAgICBmcm9udG1hdHRlcixcbiAgICBtZHhDb250ZW50LFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS1kb2NzL2NvbW1hbmRzL191dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktZG9jcy9jb21tYW5kcy9fdXRpbHMvdXRpbC5tZXgucGFyc2VNZHhGaWxlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LWRvY3MvY29tbWFuZHMvX3V0aWxzL3V0aWwubWV4LnBhcnNlTWR4RmlsZS50c1wiO2ltcG9ydCB7IGdldEJ1dHRlcnlEb2NzR3JhcGhWYWx1ZU1ldGEgfSBmcm9tIFwiLi91dGlsLmdldEJ1dHRlcnlEb2NzR3JhcGhWYWx1ZU1ldGFcIjtcbmltcG9ydCB7IGdldEJ1dHRlcnlEb2NzR3JhcGhWYWx1ZVNlY3Rpb25BbmRTZWdtZW50cyB9IGZyb20gXCIuL3V0aWwuZ2V0QnV0dGVyeURvY3NHcmFwaFZhbHVlU2VjdGlvbkFuZFNlZ21lbnRzXCI7XG5pbXBvcnQgeyBnZXRCdXR0ZXJ5RG9jc0dyYXBoVmFsdWVUT0MgfSBmcm9tIFwiLi91dGlsLmdldEJ1dHRlcnlEb2NzR3JhcGhWYWx1ZVRPQ1wiO1xuaW1wb3J0IHsgZ2V0TWR4RmlsZUNvbnRlbnQgfSBmcm9tIFwiLi91dGlsLm1keC5nZXRNZHhGaWxlQ29udGVudFwiO1xuaW1wb3J0IHR5cGUgeyBGaWxlT2JqIH0gZnJvbSBcIi4vdXRpbC50eXBlc1wiO1xuXG5leHBvcnQgY29uc3QgcGFyc2VNZHhGaWxlID0gYXN5bmMgKHtcbiAgZmlsZW5hbWUsXG4gIGZzUGF0aCxcbiAgcm91dGVQYXRoLFxufTogRmlsZU9iaikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgZnJvbnRtYXR0ZXIsIG1keENvbnRlbnQgfSA9IGF3YWl0IGdldE1keEZpbGVDb250ZW50KGZzUGF0aCk7XG4gICAgY29uc3QgbWV0YSA9IGF3YWl0IGdldEJ1dHRlcnlEb2NzR3JhcGhWYWx1ZU1ldGEoeyBmcm9udG1hdHRlciwgZmlsZW5hbWUgfSk7XG4gICAgY29uc3QgdG9jID0gZ2V0QnV0dGVyeURvY3NHcmFwaFZhbHVlVE9DKG1keENvbnRlbnQpO1xuICAgIGNvbnN0IHsgc2VnbWVudHMsIHNlY3Rpb24gfSA9XG4gICAgICBnZXRCdXR0ZXJ5RG9jc0dyYXBoVmFsdWVTZWN0aW9uQW5kU2VnbWVudHMoZmlsZW5hbWUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGZzUGF0aCxcbiAgICAgIGZpbGVuYW1lLFxuICAgICAgdG9jLFxuICAgICAgbWV0YSxcbiAgICAgIHNlY3Rpb24sXG4gICAgICByb3V0ZUFiczogcm91dGVQYXRoLFxuICAgICAgc2VnbWVudHMsXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvciBhcyBFcnJvcjtcbiAgfVxufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktZG9jcy9jb21tYW5kcy9fdXRpbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LWRvY3MvY29tbWFuZHMvX3V0aWxzL3ZpdGUtcGx1Z2luLXRyYW5zZm9ybS1tYXJrZG93bi1hc3NldC1wYXRoLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LWRvY3MvY29tbWFuZHMvX3V0aWxzL3ZpdGUtcGx1Z2luLXRyYW5zZm9ybS1tYXJrZG93bi1hc3NldC1wYXRoLnRzXCI7LyoqXG4gKiBUaGlzIHBsdWdpbiBzY2FucyAubWQgZmlsZXMgYW5kIHRyYW5zZm9ybXMgdGhlXG4gKiBhc3NldCBwYXRocyBmcm9tIC4vcHVibGljLy4uLiB0byAvLi4uIGR1cmluZyB0aGUgYnVpbGQgcHJvY2Vzcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybU1hcmtkb3duQXNzZXRQYXRoKCkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IFwibWFya2Rvd24taW1hZ2UtcGF0aC10cmFuc2Zvcm1cIixcbiAgICB0cmFuc2Zvcm0oY29kZTogc3RyaW5nLCBpZDogc3RyaW5nKSB7XG4gICAgICBpZiAoaWQuZW5kc1dpdGgoXCIubWRcIikpIHtcbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgLi9wdWJsaWMgd2l0aCAvcHVibGljIFVSTFxuICAgICAgICBjb25zdCB0cmFuc2Zvcm1lZENvZGUgPSBjb2RlLnJlcGxhY2UoXG4gICAgICAgICAgLyFcXFsoW15cXF1dKilcXF1cXChcXC5cXC9wdWJsaWNcXC8oW14pXSopXFwpL2csXG4gICAgICAgICAgXCIhWyQxXSgvJDIpXCJcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb2RlOiB0cmFuc2Zvcm1lZENvZGUsXG4gICAgICAgICAgbWFwOiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdkLE9BQU9BLFdBQVU7QUFDemUsT0FBTyxTQUFTO0FBVWhCO0FBQUEsRUFDRSxjQUFjO0FBQUEsRUFDZCxnQ0FBZ0M7QUFBQSxPQUMzQjtBQUNQLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sU0FBUztBQUNoQixPQUFPLGNBQWM7QUFDckIsT0FBTyw0QkFBNEI7QUFDbkMsT0FBT0MsaUJBQWdCO0FBQ3ZCLE9BQU8sdUJBQXVCO0FBQzlCLFNBQVMsb0JBQW9COzs7QUNyQjBhLFNBQVMsd0JBQXdCO0FBVXhlLGVBQXNCLHVCQUF1QjtBQUMzQyxTQUFPLE1BQU0saUJBQWlCLE1BQU07QUFDdEM7OztBQ1ppZCxPQUFPLFVBQVU7QUFPM2QsU0FBUywwQkFBMEIsUUFBMkI7QUFDbkUsU0FBTztBQUFBLElBQ0wsTUFBTSxLQUFLLFFBQVEsT0FBTyxXQUFXLE1BQU0sUUFBUTtBQUFBLElBQ25ELFFBQVEsS0FBSyxRQUFRLE9BQU8sV0FBVyxNQUFNLGVBQWU7QUFBQSxFQUM5RDtBQUNGOzs7QUNacWMsU0FBUyxlQUFlO0FBQzdkLE9BQU9DLFdBQVU7OztBQ0Q2YSxTQUFTLGFBQWEsVUFBa0I7QUFFcGUsTUFBSSxhQUFhLFVBQVU7QUFDekIsV0FBTztBQUFBLEVBQ1Q7QUFDQSxTQUFPLElBQUksT0FBTyxTQUFTLE1BQU0sR0FBRyxFQUFFLEtBQUssR0FBRyxDQUFDO0FBQ2pEOzs7QUNOMmEsU0FBUyxxQkFBcUI7QUFFbGMsSUFBTSxXQUFXLElBQUksY0FBYztBQUFBLEVBQ3hDLFFBQVE7QUFBQSxFQUNSLGtCQUFrQjtBQUFBLEVBQ2xCLFFBQVE7QUFDVixDQUFDOzs7QUNOeWMsSUFBTSxnQkFBZ0IsQ0FBQyxhQUFxQjtBQUNwZixTQUFPO0FBQUEsSUFDTCxTQUFTLFNBQVMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUFBLEVBQ2hDO0FBQ0Y7OztBQ0NPLFNBQVMsV0FBVztBQUFBLEVBQ3pCLFlBQVksRUFBRSxNQUFNO0FBQUEsRUFDcEI7QUFDRixHQUdjO0FBQ1osTUFBSSxrQkFBa0I7QUFFdEIsTUFBSSxDQUFDLE9BQU87QUFDVixhQUFTO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFFQSxzQkFBa0IsTUFBTSxPQUErQixDQUFDLE9BQU8sU0FBUztBQUN0RSxZQUFNLEVBQUUsUUFBUSxJQUFJLGNBQWMsS0FBSyxRQUFRO0FBQy9DLGNBQVEsSUFBSSxPQUFPO0FBRW5CLGFBQU87QUFBQSxJQUNULEdBQUcsQ0FBQyxDQUFDO0FBQ0wsV0FBTztBQUFBLEVBQ1Q7QUFFQSxRQUFNLFNBQW9CLENBQUM7QUFHM0IsYUFBVyxXQUFXLE9BQU87QUFDM0IsVUFBTSxlQUFlLE1BQU0sT0FBTyxFQUFFO0FBQ3BDLGVBQVcsZ0JBQWdCLGNBQWM7QUFFdkMsWUFBTSxtQkFBbUIsTUFBTSxLQUFLLENBQUMsU0FBUyxLQUFLLGFBQWEsT0FBTztBQUN2RSxZQUFNLDRCQUE0QixPQUFPO0FBQUEsUUFDdkMsQ0FBQyxNQUFNLEVBQUUsYUFBYSxrQkFBa0I7QUFBQSxNQUMxQztBQUNBLFVBQUksQ0FBQyw2QkFBNkIsa0JBQWtCO0FBQ2xELGVBQU8sS0FBSyxnQkFBZ0I7QUFBQSxNQUM5QjtBQUdBLFlBQU0sY0FBYyxNQUFNO0FBQUEsUUFDeEIsQ0FBQyxTQUFTLEtBQUssYUFBYSxHQUFHLE9BQU8sSUFBSSxZQUFZO0FBQUEsTUFDeEQ7QUFDQSxVQUFJO0FBQWEsZUFBTyxLQUFLLFdBQVc7QUFBQSxJQUMxQztBQUFBLEVBQ0Y7QUFFQSxhQUFXLFFBQVEsT0FBTztBQUN4QixVQUFNLHFCQUFxQixPQUFPO0FBQUEsTUFDaEMsQ0FBQyxVQUFVLE1BQU0sYUFBYSxLQUFLO0FBQUEsSUFDckM7QUFDQSxRQUFJLENBQUMsc0JBQXNCLEtBQUssYUFBYSxVQUFVO0FBRXJELGFBQU8sUUFBUSxJQUFJO0FBQUEsSUFDckIsV0FBVyxDQUFDLG9CQUFvQjtBQUU5QixlQUFTO0FBQUEsUUFDUCx5QkFBeUIsS0FBSyxRQUFRO0FBQUEsTUFDeEM7QUFDQSxhQUFPLEtBQUssSUFBSTtBQUFBLElBQ2xCO0FBQUEsRUFDRjtBQUNBLFNBQU87QUFDVDs7O0FDakVBLGVBQXNCLDZCQUE2QjtBQUFBLEVBQ2pEO0FBQUEsRUFDQTtBQUNGLEdBR0c7QUFFRCxNQUFJLENBQUMsWUFBWSxPQUFPO0FBQ3RCLGFBQVM7QUFBQSxNQUNQLElBQUksUUFBUSxzQ0FBc0MsUUFBUTtBQUFBLElBQzVEO0FBQUEsRUFDRjtBQUVBLFNBQU87QUFBQSxJQUNMLE9BQU8sYUFBYSxTQUFTO0FBQUEsRUFDL0I7QUFDRjs7O0FDbkIwZixJQUFNLDZDQUE2QyxDQUMzaUIsYUFDNEM7QUFDNUMsUUFBTSxjQUFjLFNBQVMsTUFBTSxHQUFHO0FBQ3RDLFFBQU0sQ0FBQyxTQUFTLEdBQUcsUUFBUSxJQUFJO0FBRS9CLFNBQU87QUFBQSxJQUNMO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFDRjs7O0FDVnFkLE9BQU8saUJBQWlCO0FBQzdlLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8scUJBQXFCO0FBQzVCLE9BQU8sZUFBZTtBQUN0QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGtCQUFrQjtBQUN6QixTQUFTLGVBQWU7QUFDeEIsU0FBUyxhQUFhO0FBR2YsU0FBUyw0QkFBNEIsaUJBQXlCO0FBQ25FLFFBQU0sT0FBTyxRQUFRLEVBQ2xCLElBQUksV0FBVyxFQUNmLElBQUksU0FBUyxFQUNiLElBQUksWUFBWSxFQUNoQixJQUFJLFVBQVUsRUFDZCxJQUFJLGVBQWUsRUFDbkIsWUFBWSxlQUFlO0FBQzlCLFFBQU0sT0FBTyxRQUFRLEVBQ2xCLElBQUksYUFBYSxFQUFFLFVBQVUsS0FBSyxDQUFDLEVBQ25DLE1BQU0sS0FBSyxTQUFTLENBQUM7QUFFeEIsUUFBTSxNQUE2QixDQUFDO0FBQ3BDLFFBQU0sUUFBK0IsQ0FBQztBQUd0QyxRQUFNLE1BQU0sV0FBVyxDQUFDLFNBQWM7QUFDcEMsUUFDRSxLQUFLLFFBQVEsTUFBTSxVQUFVLEtBQzdCLEtBQUssY0FDTCxLQUFLLFdBQVcsSUFDaEI7QUFDQSxZQUFNLFFBQVEsT0FBTyxTQUFTLEtBQUssUUFBUSxDQUFDLEdBQUcsRUFBRTtBQUNqRCxZQUFNLFFBQVEsS0FBSyxTQUVoQixJQUFJLENBQUMsVUFBZTtBQUNuQixZQUFJLE1BQU0sU0FBUztBQUFRLGlCQUFPLE1BQU07QUFDeEMsWUFBSSxNQUFNLFNBQVM7QUFBTSxpQkFBTztBQUNoQyxZQUNFLE1BQU0sU0FBUyxjQUNkLE1BQU0sWUFBWSxPQUFPLE1BQU0sWUFBWSxTQUM1QztBQUVBLGlCQUFPLE1BQU0sU0FBUyxJQUFJLENBQUMsV0FBZ0IsT0FBTyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQUEsUUFDbEU7QUFDQSxlQUFPO0FBQUEsTUFDVCxDQUFDLEVBQ0EsS0FBSyxFQUFFO0FBQ1YsWUFBTSxPQUFPLElBQUksS0FBSyxXQUFXLEVBQUU7QUFDbkMsWUFBTSxhQUFrQztBQUFBLFFBQ3RDO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBLFVBQVUsQ0FBQztBQUFBLE1BQ2I7QUFFQSxhQUFPLE1BQU0sVUFBVSxNQUFNLE1BQU0sU0FBUyxDQUFDLEVBQUUsU0FBUyxPQUFPO0FBQzdELGNBQU0sSUFBSTtBQUFBLE1BQ1o7QUFFQSxVQUFJLE1BQU0sUUFBUTtBQUNoQixjQUFNLE1BQU0sU0FBUyxDQUFDLEVBQUUsU0FBUyxLQUFLLFVBQVU7QUFBQSxNQUNsRCxPQUFPO0FBQ0wsWUFBSSxLQUFLLFVBQVU7QUFBQSxNQUNyQjtBQUVBLFlBQU0sS0FBSyxVQUFVO0FBQUEsSUFDdkI7QUFBQSxFQUNGLENBQUM7QUFFRCxTQUFPO0FBQ1Q7OztBQ3ZFeWMsU0FBUyxnQkFBZ0I7QUFDbGUsT0FBTyxZQUFZO0FBRW5CLGVBQXNCLGtCQUFrQixVQUFrQjtBQUN4RCxRQUFNLGdCQUFnQixNQUFNLFNBQVMsVUFBVSxFQUFFLFVBQVUsT0FBTyxDQUFDO0FBRW5FLFFBQU0sRUFBRSxNQUFNLGFBQWEsU0FBUyxXQUFXLElBQUksT0FBTyxhQUFhO0FBQ3ZFLFNBQU87QUFBQSxJQUNMO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFDRjs7O0FDTE8sSUFBTSxlQUFlLE9BQU87QUFBQSxFQUNqQztBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0YsTUFBZTtBQUNiLE1BQUk7QUFDRixVQUFNLEVBQUUsYUFBYSxXQUFXLElBQUksTUFBTSxrQkFBa0IsTUFBTTtBQUNsRSxVQUFNLE9BQU8sTUFBTSw2QkFBNkIsRUFBRSxhQUFhLFNBQVMsQ0FBQztBQUN6RSxVQUFNLE1BQU0sNEJBQTRCLFVBQVU7QUFDbEQsVUFBTSxFQUFFLFVBQVUsUUFBUSxJQUN4QiwyQ0FBMkMsUUFBUTtBQUVyRCxXQUFPO0FBQUEsTUFDTDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBLFVBQVU7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0YsU0FBUyxPQUFPO0FBQ2QsVUFBTTtBQUFBLEVBQ1I7QUFDRjs7O0FUVk8sSUFBTSxjQUFjLE9BQU87QUFBQSxFQUNoQztBQUFBLEVBQ0E7QUFDRixNQUdpQztBQUMvQixXQUFTLE1BQU0sNENBQTRDO0FBQzNELFFBQU0sUUFBMEIsQ0FBQztBQUVqQyxpQkFBZSxXQUFXLE1BQWU7QUFDdkMsVUFBTSxhQUFhLE1BQU0sYUFBYSxJQUFJO0FBQzFDLFFBQUksQ0FBQztBQUFZO0FBQ2pCLFVBQU07QUFBQSxNQUNKLE1BQU0sRUFBRSxNQUFNO0FBQUEsTUFDZDtBQUFBLE1BQ0E7QUFBQTtBQUFBLE1BRUE7QUFBQSxNQUNBO0FBQUEsSUFDRixJQUFJO0FBRUosVUFBTSxlQUNKLFlBQVksUUFBUSxPQUFPLEdBQUcsV0FBVyxRQUFRLFFBQVEsTUFBTSxHQUFHO0FBRXBFLFFBQUksV0FBVyxDQUFDLE1BQU0sT0FBTyxHQUFHO0FBQzlCLFlBQU0sT0FBTyxJQUFJO0FBQUEsUUFDZixPQUFPO0FBQUEsUUFDUCxVQUFVLEtBQUs7QUFBQSxRQUNmLFVBQVUsSUFBSSxZQUFZLFdBQVcsS0FBSyxPQUFPO0FBQUEsUUFDakQsVUFBVSxZQUFZLFdBQVcsTUFBTTtBQUFBLFFBQ3ZDLEtBQUssQ0FBQztBQUFBLFFBQ04sT0FBTyxDQUFDO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFNQSxRQUFJLGVBQWUsVUFBVSxNQUFNLE9BQU8sRUFBRSxRQUFRO0FBRXBELGVBQVcsZ0JBQWdCLFVBQVU7QUFDbkMsWUFBTSxJQUFJLE9BQU8sWUFBWTtBQUM3QixZQUFNLFVBQVUsU0FBUyxDQUFDO0FBQzFCLFVBQUksQ0FBQyxhQUFhLE9BQU8sR0FBRztBQUMxQixxQkFBYSxPQUFPLElBQUk7QUFBQSxVQUN0QixPQUFPO0FBQUEsVUFDUCxVQUFVO0FBQUEsVUFDVixVQUFVO0FBQUEsVUFDVixVQUFVO0FBQUEsVUFDVixLQUFLLENBQUM7QUFBQSxVQUNOLE9BQU8sQ0FBQztBQUFBLFFBQ1Y7QUFBQSxNQUNGO0FBRUEsVUFBSSxNQUFNLFNBQVMsU0FBUyxHQUFHO0FBQzdCLHFCQUFhLE9BQU8sRUFBRSxRQUFRO0FBQzlCLHFCQUFhLE9BQU8sRUFBRSxXQUFXLEtBQUs7QUFDdEMscUJBQWEsT0FBTyxFQUFFLFdBQVc7QUFDakMscUJBQWEsT0FBTyxFQUFFLFdBQVc7QUFDakMscUJBQWEsT0FBTyxFQUFFLE1BQU07QUFBQSxNQUM5QixPQUFPO0FBQ0wsdUJBQWUsYUFBYSxPQUFPLEVBQUU7QUFBQSxNQUN2QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBR0EsYUFBVyxhQUFhLE9BQU87QUFDN0IsVUFBTSxPQUFPLE1BQU0sU0FBUztBQUM1QixVQUFNLFdBQVcsSUFBSTtBQUFBLEVBQ3ZCO0FBRUEsV0FBUyxNQUFNLGtEQUFrRDtBQUNqRSxTQUFPO0FBQ1Q7QUFVQSxlQUFzQixvQkFBb0IsUUFBMkI7QUFDbkUsUUFBTSxrQkFBa0IsMEJBQTBCLE1BQU07QUFJeEQsUUFBTSxrQkFBa0IsTUFBTSxRQUFRLGdCQUFnQixNQUFNO0FBQUEsSUFDMUQsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLEVBQ2pCLENBQUM7QUFDRCxRQUFNLGVBQWUsZ0JBQWdCLE9BTW5DLENBQUMsT0FBTyxXQUFXO0FBQ25CLFVBQU0sU0FBUyxPQUFPLE9BQU87QUFDN0IsUUFBSSxDQUFDO0FBQVEsYUFBTztBQUNwQixVQUFNLFNBQVMsT0FBTyxXQUFXLE9BQU8sR0FBRyxFQUFFLE9BQU8sT0FBTyxJQUFJO0FBQy9ELFVBQU0sV0FBV0MsTUFBSyxNQUFNLE9BQU8sSUFBSSxFQUFFO0FBQ3pDLFVBQU0sWUFBWSxhQUFhLFFBQVE7QUFFdkMsV0FBTyxNQUFNLE9BQU87QUFBQSxNQUNsQjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSCxHQUFHLENBQUMsQ0FBQztBQUdMLFFBQU0sUUFBUSxXQUFXO0FBQUEsSUFDdkIsWUFBWSxPQUFPO0FBQUEsSUFDbkIsT0FBTztBQUFBLEVBQ1QsQ0FBQztBQUdELFFBQU0sWUFBWSxNQUFNLFlBQVk7QUFBQSxJQUNsQyxZQUFZLE9BQU87QUFBQSxJQUNuQjtBQUFBLEVBQ0YsQ0FBQztBQUNELFNBQU87QUFDVDs7O0FVL0lPLFNBQVMsNkJBQTZCO0FBQzNDLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFVBQVUsTUFBYyxJQUFZO0FBQ2xDLFVBQUksR0FBRyxTQUFTLEtBQUssR0FBRztBQUV0QixjQUFNLGtCQUFrQixLQUFLO0FBQUEsVUFDM0I7QUFBQSxVQUNBO0FBQUEsUUFDRjtBQUNBLGVBQU87QUFBQSxVQUNMLE1BQU07QUFBQSxVQUNOLEtBQUs7QUFBQSxRQUNQO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7OztBYnJCQSxJQUFNLG1DQUFtQztBQTZCekMsSUFBTSxvQkFBb0IsTUFBTSxxQkFBcUI7QUFDckQsSUFBTSx5QkFBeUIsMEJBQTBCLGlCQUFpQjtBQUcxRSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixXQUFXLHVCQUF1QjtBQUFBLEVBQ2xDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNILE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixnQkFBZ0IsUUFBUTtBQUN0QixjQUFNLGdCQUFnQixTQUFTLE1BQU0sdUJBQXVCLElBQUk7QUFDaEUsaUJBQVM7QUFBQSxVQUNQLHVDQUF1Qyx1QkFBdUIsSUFBSTtBQUFBLFFBQ3BFO0FBRUEsc0JBQWMsR0FBRyxVQUFVLENBQUNDLFVBQVM7QUFDbkMsbUJBQVMsS0FBSyxJQUFJQSxLQUFJLDZCQUE2QjtBQUNuRCxpQkFBTyxHQUFHLEtBQUs7QUFBQSxZQUNiLE1BQU07QUFBQSxZQUNOLE1BQUFBO0FBQUEsVUFDRixDQUFDO0FBQUEsUUFDSCxDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxJQUNBLDJCQUEyQjtBQUFBLElBQzNCLElBQUk7QUFBQSxNQUNGLGVBQWUsQ0FBQyxpQkFBaUI7QUFBQSxNQUNqQyxlQUFlO0FBQUEsUUFDYkM7QUFBQSxRQUNBO0FBQUEsVUFDRTtBQUFBLFVBQ0E7QUFBQSxZQUNFLFVBQVU7QUFBQSxZQUNWLG1CQUFtQjtBQUFBLGNBQ2pCLFdBQVc7QUFBQSxZQUNiO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxRQUNBO0FBQUEsVUFDRTtBQUFBLFVBQ0E7QUFBQSxZQUNFLE9BQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELElBQUk7QUFBQSxNQUNGLFNBQVM7QUFBQSxNQUNULGNBQWM7QUFBQSxRQUNaLFNBQVMsQ0FBQyw0QkFBNEIscUJBQXFCO0FBQUEsTUFDN0Q7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELHdCQUF3QjtBQUFBLElBQ3hCLE1BQU07QUFBQSxNQUNKLGNBQWNELE1BQUssUUFBUSxrQ0FBcUIsT0FBTztBQUFBLE1BQ3ZELE1BQU0sT0FBTyxjQUFjO0FBQ3pCLGNBQU0sbUJBQW1CLE1BQU0sb0JBQW9CLGlCQUFpQjtBQUVwRSxnQkFBUSxJQUFJLEtBQUssVUFBVSxrQkFBa0IsTUFBTSxDQUFDLENBQUM7QUFFckQsY0FBTSxTQUFTLGFBQWEsQ0FBQyxVQUFVO0FBQ3JDLG1CQUFTLHFCQUFxQixPQUF5QjtBQUNyRCx1QkFBVyxjQUFjLE9BQU8sT0FBTyxLQUFLLEdBQUc7QUFDN0Msb0JBQU0sRUFBRSxVQUFVLFVBQVUsTUFBTSxJQUFJO0FBQ3RDLG9CQUFNLGlCQUFpQixPQUFPLEtBQUssS0FBSyxFQUFFLFNBQVM7QUFLbkQsb0JBQU0sVUFBVSxVQUFVLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFFekMsa0JBQUksZ0JBQWdCO0FBRWxCLHFDQUFxQixLQUFLO0FBQUEsY0FDNUI7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUNBO0FBQUEsWUFDRTtBQUFBLFlBQ0FBLE1BQUssUUFBUSxrQ0FBcUIsMEJBQTBCO0FBQUEsWUFDNUQsTUFBTTtBQUNKLG1DQUFxQixnQkFBZ0I7QUFBQSxZQUN2QztBQUFBLFVBQ0Y7QUFBQSxRQUNGLENBQUM7QUFHRCxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIiwgInJlaHlwZVNsdWciLCAicGF0aCIsICJwYXRoIiwgInBhdGgiLCAicmVoeXBlU2x1ZyJdCn0K
