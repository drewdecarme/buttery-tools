/* eslint-disable import/no-unresolved */
import type { ButteryDocsRouteManifest } from "@buttery/core/config";
import type { Manifest } from "vite";

import {
  type CFContext,
  handleRequestCloudflarePages,
} from "@buttery/docs/server.cloudflare-pages";

// @ts-expect-error This will only exist when the app is built
import butteryManifest from "../build/client/.buttery/buttery.manifest.json";
// @ts-expect-error This will only exist when the app is built
import viteManifest from "../build/client/.vite/manifest.json";
// @ts-expect-error This will only exist when the app is built
import { render } from "../build/server/server.js";

export async function onRequest(cfContext: CFContext) {
  const response = await handleRequestCloudflarePages(render, {
    cfContext,
    bManifest: butteryManifest as ButteryDocsRouteManifest,
    vManifest: viteManifest as Manifest,
  });

  return response;
}
