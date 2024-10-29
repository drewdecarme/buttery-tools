import { Transform } from "node:stream";
import { parseAndValidateOptions } from "@buttery/core/utils/node";
import { ButteryMeta } from "@buttery/meta";
import express from "express";
import open from "open";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { createServer } from "vite";
import type { z } from "zod";
import { getButteryDocsConfig } from "../getButteryDocsConfig";
import { getButteryDocsDirectories } from "../getButteryDocsDirectories";
import { getButteryDocsViteConfig } from "../getButteryDocsViteConfig";
import { generateHTMLTemplate } from "../lib/server/generateHTMLTemplate";
import { LOG } from "../utils";
import { devSchema } from "./_options.schema";

export type ButteryDocsBuildOptions = Partial<z.infer<typeof devSchema>>;

process.env.NODE_ENV = "development";

export async function dev(options?: ButteryDocsBuildOptions) {
  const parsedOptions = parseAndValidateOptions(devSchema, options, LOG);
  LOG.level = parsedOptions.logLevel;

  LOG.info("Starting @buttery/docs DevServer...");

  // Process and store configurations
  const config = await getButteryDocsConfig({
    prompt: parsedOptions.prompt,
  });
  const dirs = await getButteryDocsDirectories(config);
  const viteConfig = getButteryDocsViteConfig(config, dirs);

  // Set some constants
  const ABORT_DELAY = 10_000;
  const PORT = parsedOptions.port;
  const HOSTNAME = "http://localhost";
  const HOSTNAME_AND_PORT = `${HOSTNAME}:${PORT}`;

  // create an express app
  const app = express();

  // create the vite middleware
  LOG.debug("Creating vite server & running in middleware mode.");
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
    LOG.debug(
      "Instantiating ButteryMeta to SSR meta, title, description and og tags"
    );
    const Meta = new ButteryMeta();

    try {
      const url = req.originalUrl;

      // Load the server-entry file as a module
      const ssrEntryModule = await vite.ssrLoadModule(dirs.app.appEntryServer);

      // create the HTML template
      const { htmlDev } = generateHTMLTemplate({
        cssLinks: [dirs.app.css.tokens, dirs.app.css.docsUI],
        jsScripts: [dirs.app.appEntryClient],
        Meta,
      });

      // allow vite to inject the necessary scripts
      const htmlTemplate = await vite.transformIndexHtml(url, htmlDev);

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

            // inject critical css (Hydration issues at the moment)
            // const docsUiCssContent = readFileSync(dirs.app.css.docsUI, "utf8");
            // const { critical } = collect(htmlTemplate, docsUiCssContent);
            // htmlStart = htmlTemplate.replace("<!--ssr-critical-->", critical);

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
    LOG.watch(`@buttery/docs DevServer running on ${HOSTNAME_AND_PORT}`);

    // Open the DevServer if it has been configured to do so
    if (!parsedOptions.open) return;
    open(HOSTNAME_AND_PORT);
  });
}
