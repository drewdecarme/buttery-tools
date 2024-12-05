// add the beginning of your app entry
import "vite/modulepreload-polyfill";
import { createRenderCloudflarePages } from "@buttery/docs/server.cloudflare-pages";

import { routes } from "./routes";

export const render = createRenderCloudflarePages(routes);
