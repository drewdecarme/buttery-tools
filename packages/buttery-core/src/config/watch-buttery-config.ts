import { watch } from "chokidar";

import { LOG } from "../utils/util.logger.js";

/**
 * Watches a buttery config for any changes and runs a callback
 * when the configuration changes
 */
export function watchButteryConfigForChanges(
  configPath: string,
  { onChange }: { onChange: () => Promise<void> }
) {
  const watcher = watch(configPath);
  LOG.watch(`Watching ${configPath} for changes`);

  watcher.on("change", async (file) => {
    LOG.watch(`"${file}" changed.`);
    await onChange();
  });
}
