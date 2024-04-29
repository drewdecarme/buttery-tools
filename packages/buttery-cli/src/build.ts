import { buildCommands } from "./build.commands.js";
import { buildEnrichPackageJson } from "./build.enrich-package-json.js";
import { buildEntryFile } from "./build.entry-file.js";

try {
  await buildCommands(process.argv.slice(2));
  await buildEntryFile();
  await buildEnrichPackageJson();
} catch (error) {
  console.error(error);
}
