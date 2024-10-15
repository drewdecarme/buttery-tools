import { Transform } from "node:stream";
import { ButteryMeta } from "@buttery/meta";
import express from "express";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { createServer } from "vite";
import { getButteryDocsConfig } from "../utils/docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../utils/docs.getButteryDocsDirectories";
import { getButteryDocsViteConfig } from "../utils/docs.getButteryDocsViteConfig";
import { LOG } from "../utils/docs.utils";
import { generateHTMLTemplate } from "../utils/generateHTMLTemplate";

export async function dev() {
  // Process and store configurations
  const config = await getButteryDocsConfig();
  const dirs = await getButteryDocsDirectories(config);
  const viteConfig = getButteryDocsViteConfig(config, dirs);

  // Set some constants
  const ABORT_DELAY = 10_000;
  const PORT = 4000;

  // create an express app
  const app = express();

  // create the vite middleware
  const vite = await createServer({
    ...viteConfig,
    root: dirs.app.root, // Root directory for the Vite project
    appType: "custom", // Avoid Vite's default HTML handling,
    clearScreen: false,
    server: {
      middlewareMode: true, // Enable SSR middleware mode
      hmr: {
        port: 3005,
      },
    },
  });

  // Add vite as middleware
  app.use(vite.middlewares);

  // Serve the HTML upon every request for a full page reload
  // This will only happen on full refresh and then the client
  // will be hydrated and any subsequent applications will be managed
  // by the react router
  app.use("*", async (req, res) => {
    // instantiate a new instances of Meta
    // which will track any meta tags or json used in the
    // doc files for SEO
    const Meta = new ButteryMeta();

    try {
      const url = req.originalUrl;

      // Load the server-entry file as a module
      const ssrEntryModule = await vite.ssrLoadModule(dirs.app.appEntryServer);

      // create the HTML template
      const html = generateHTMLTemplate({
        cssLinks: [dirs.app.css.tokens, dirs.app.css.docsUI],
        jsScripts: [dirs.app.appEntryClient], // during
        metaTags: Meta.renderNodesToString(),
      });

      // allow vite to inject the necessary scripts
      const htmlTemplate = await vite.transformIndexHtml(url, html);

      const ssrManifest = undefined;
      let didError = false;

      const { pipe, abort } = await ssrEntryModule.render(
        url,
        Meta,
        ssrManifest,
        {
          onShellError() {
            res.status(500);
            res.set({ "Content-Type": "text/html" });
            res.send("<h1>Something went wrong</h1>");
          },
          onAllReady() {
            res.status(didError ? 500 : 200);
            res.set({ "Content-Type": "text/html" });

            // Split the HTML into two parts
            const [htmlStart, htmlEnd] =
              htmlTemplate.split("<!--ssr-outlet-->");

            // Start writing the first part with the headers
            res.write(htmlStart);

            // Stream the chunks in one at a time
            const transformStream = new Transform({
              transform(chunk, encoding, callback) {
                res.write(chunk, encoding);
                callback();
              },
            });

            // When the stream is complete, tack on the end of
            // the HTML
            transformStream.on("finish", () => {
              res.end(htmlEnd);
            });

            // pipe the stream back into the response
            pipe(transformStream);
          },
          onError(error: Error) {
            didError = true;
            console.error(error);
          },
        } as RenderToPipeableStreamOptions
      );

      setTimeout(() => {
        abort();
      }, ABORT_DELAY); // 10 seconds
    } catch (e) {
      const error = e as Error;
      // Handle errors with Vite's SSR stack trace
      vite.ssrFixStacktrace(error);
      LOG.fatal(error);
      res.status(500).end(error.stack);
    }
  });

  app.listen(PORT, () => {
    LOG.watch(`Local SSR server running at http://localhost:${PORT}`);
  });
}
