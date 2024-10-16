import { ButteryMeta } from "@buttery/meta";
import type { ManifestChunk } from "vite";
import { generateHTMLTemplate } from "../../../../utils/generateHTMLTemplate.js";
import butteryManifest from "../build/client/.buttery/buttery.manifest.json";
import viteManifest from "../build/client/.vite/manifest.json";
import { render } from "../build/server/server.js";

const viteManifestEntries = Object.entries(viteManifest);

export async function onRequest(context) {
  const { request } = context;
  const { pathname } = new URL(request.url);

  // Check for static assets
  if (pathname.startsWith("/assets") || pathname.startsWith("/favicon")) {
    try {
      return await context.env.ASSETS.fetch(request);
    } catch (error) {
      console.error(`Error serving static file: ${pathname}`, error);
      return new Response("Not Found", { status: 404 });
    }
  }

  try {
    // Match the routeId to the pathname
    const routeIdForPathname = Object.entries(butteryManifest).reduce<
      string | undefined
    >((accum, [entryKey, entryValue]) => {
      if (entryValue.routePath === pathname) {
        return entryKey;
      }
      return accum;
    }, undefined);

    if (!routeIdForPathname) {
      throw `Cannot locate a route entry that matches ${pathname}`;
    }

    // Find the vite manifest entry that matches the routeId
    // first normalize the key to match the relative path to the .buttery/docs
    // folder. From there we can loop through the viteManifest and fine the route
    // in the buttery manifest that matches the key of the vite manifest
    const viteManifestEntryForPathname = Object.entries(viteManifest).reduce<
      ManifestChunk | undefined
    >((accum, [entryKey, entryValue]) => {
      const normalizedKey = entryKey.split(".buttery/docs")[1];
      if (normalizedKey === routeIdForPathname) {
        return entryValue;
      }
      return accum;
    }, undefined);

    if (!viteManifestEntryForPathname) {
      throw `Could not locate a manifest entry that matches the route: ${pathname}`;
    }

    // loop through the viteManifest to get the manifest entry
    // that is the entry to the app. This allows us to find the CSS
    // that was bundled to the app.
    const entryKey = viteManifestEntries.reduce<string | undefined>(
      (accum, [entryKey, entryValue]) => {
        // @ts-expect-error there's a mismatch on the union
        if (entryValue.isEntry) {
          return entryKey;
        }
        return accum;
      },
      undefined
    );

    if (!entryKey) {
      throw `Cannot locate an base entry in the manifest. This should not have happened.`;
    }

    // collect the css
    const cssEntries = viteManifest[entryKey].css;

    // collect the meta
    const Meta = new ButteryMeta();

    // recursively collect the scripts by checking the imports
    // of the file
    const scriptsSet = new Set<string>();
    function collectScripts(manifestEntry: ManifestChunk) {
      for (const importScript of manifestEntry.imports ?? []) {
        scriptsSet.add(viteManifest[importScript].file);
        collectScripts(viteManifest[importScript]);
      }
    }
    collectScripts(viteManifestEntryForPathname);
    scriptsSet.add(viteManifestEntryForPathname.file);
    const scriptEntries = [...scriptsSet.values()];

    // Dynamically create the HTML shell where the scripts, meta, and
    // css are inserted into the app... this will allow for hydration on
    // the client once the first request is made
    const html = generateHTMLTemplate({
      cssLinks: cssEntries,
      jsScripts: scriptEntries, // during
      metaTags: Meta.renderNodesToString(),
    });
    const [htmlStart, htmlEnd] = html.split("<!--ssr-outlet-->");

    const responseStatusCode = 200;
    const responseHeaders = new Headers();
    const encoder = new TextEncoder();

    // Generate the stream using the `render` function from the server bundle
    const streamBody = await render(pathname, responseStatusCode, Meta);

    // Insert the app body into the HTML shell
    const stream = new ReadableStream({
      async start(controller) {
        // 1. Send the head and opening body tags
        controller.enqueue(encoder.encode(htmlStart));

        // 2. Pipe the SSR stream into the response
        const reader = streamBody.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value); // Send each chunk of React's stream
        }

        // 3. End with the closing body and html tags
        controller.enqueue(encoder.encode(htmlEnd));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: responseHeaders,
      status: responseStatusCode,
    });
  } catch (error) {
    console.error("Error during SSR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
