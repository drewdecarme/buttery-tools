import type { ButteryDocsRouteManifest } from "@buttery/config";
import { ButteryMeta } from "@buttery/meta";
import type { EventPluginContext } from "@cloudflare/workers-types";
import type { Manifest as ViteManifest } from "vite";
import { generateHTMLTemplate } from "./generateHTMLTemplate";
import { getButteryRouteIdFromRequest } from "./getButteryRouteFromRequest";
import { getRouteAssets } from "./getRouteAssets";

export type SSRRender = (
  route: string,
  responseStatusCode: number,
  ButteryMeta: ButteryMeta
  // biome-ignore lint/suspicious/noExplicitAny: This is going to be a stream, but it doesn't really matter all that much
) => Promise<any>;

export type CFContext = EventPluginContext<
  unknown,
  // biome-ignore lint/suspicious/noExplicitAny: The Any mimics what's in the @cloudflare/workers-types library
  any,
  Record<string, unknown>,
  unknown
>;

export async function handleRequestCloudflarePages(
  render: SSRRender,
  {
    context,
    vManifest,
    bManifest,
  }: {
    context: CFContext;
    vManifest: ViteManifest;
    bManifest: ButteryDocsRouteManifest;
  }
) {
  // Get the route name that we're attempting to request
  const { pathname } = new URL(context.request.url);

  // Handle any assets
  if (pathname.startsWith("/assets") || pathname.startsWith("/favicon")) {
    try {
      return await context.env.ASSETS.fetch(context.request);
    } catch (error) {
      console.error(`Error serving static file: ${pathname}`, error);
      return new Response("Not Found", { status: 404 });
    }
  }

  try {
    // match the buttery route with the request.pathname
    const routeId = getButteryRouteIdFromRequest(pathname, bManifest);

    // get the css and js assets from the vite manifest
    const { cssAssets, jsAssets } = getRouteAssets(routeId, vManifest);

    // Instantiate a new Meta class to collect the meta tags for each page
    const Meta = new ButteryMeta();

    // Insert the assets into the HTML template start and end
    const { htmlStart, htmlEnd } = generateHTMLTemplate({
      cssLinks: cssAssets,
      jsScripts: jsAssets,
      Meta,
    });

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
