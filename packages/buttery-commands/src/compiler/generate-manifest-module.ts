import type { ButteryCommandsManifest } from "../command-utils.js";

export async function generateManifestModule(
  cmdManifest: ButteryCommandsManifest
): Promise<string> {
  function generateModuleCode(manifest: ButteryCommandsManifest): string {
    const commands = Object.entries(manifest)
      .map(([key, entry]) => {
        const actionCode = entry.action ? entry.action.toString() : "undefined";
        const subCommandsCode = generateModuleCode(entry.subCommands); // Recursively handle subcommands

        return `
        "${key}": {
          meta: ${JSON.stringify(entry.meta)},
          options: ${JSON.stringify(entry.options)},
          args: ${JSON.stringify(entry.args)},
          action: ${actionCode},
          subCommands: ${subCommandsCode}
        }
      `;
      })
      .join(",\n");

    return `{ ${commands} }`;
  }

  const manifestModule = `export default ${generateModuleCode(cmdManifest)};`;
  return manifestModule;
}
