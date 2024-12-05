// add the beginning of your app entry
import "vite/modulepreload-polyfill";

import { createRenderDev } from "@buttery/docs/server.dev";

import { routes } from "./routes";

export const render = createRenderDev(routes);
