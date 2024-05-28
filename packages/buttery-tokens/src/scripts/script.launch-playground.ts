import path from "node:path";
import { createServer } from "vite";

export async function launchPlayground() {
  const server = await createServer({
    // any valid user config options, plus `mode` and `configFile`
    configFile: false,
    root: path.resolve(import.meta.dirname, "../../playground"),
    server: {
      port: 1337
    }
  });
  await server.listen();

  server.printUrls();
  server.bindCLIShortcuts({ print: true });
}
