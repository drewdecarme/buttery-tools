import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { ResolvedButteryConfig } from "../_buttery-config";
import { getButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import { LOG_DOCS } from "./docs.logger";
import type { ButteryDocsGraph } from "./docs.types";

export async function bootstrapAppDataFile(params: {
  config: ResolvedButteryConfig<"docs">;
  graph: ButteryDocsGraph;
}) {
  const dirs = await getButteryDocsDirectories(params.config);

  try {
    LOG_DOCS.debug("Creating data file...");
    const dataFilePath = path.resolve(
      dirs.artifacts.apps.generated.root,
      "./app/data.ts"
    );
    await writeFile(
      dataFilePath,
      `import type { ResolvedButteryConfig } from "@buttery/core";
import type { ButteryDocsGraph } from "../../../../.buttery/commands/docs/shared.types";

export const graph: ButteryDocsGraph = ${JSON.stringify(params.graph, null, 2)};
export const header: ResolvedButteryConfig<"docs">["docs"]["header"] = ${JSON.stringify(params.config.docs.header)};
`
    );
    LOG_DOCS.debug("Creating data file... done");
  } catch (error) {}
}
