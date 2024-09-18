import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { ResolvedButteryConfig } from "../_buttery-config";
import { LOG } from "../_logger/util.ts.logger";
import { getButteryDocsDirectories } from "./docs.getButteryDocsDirectories";
import type { ButteryDocsGraph } from "./docs.types";

export async function bootstrapAppDataFile(params: {
  config: ResolvedButteryConfig<"docs">;
  graph: ButteryDocsGraph;
}) {
  const dirs = await getButteryDocsDirectories(params.config);

  try {
    LOG.debug("Creating data file...");
    const dataFilePath = path.resolve(
      dirs.lib.apps.generated.root,
      "./app/data.ts"
    );
    await writeFile(
      dataFilePath,
      `import type { ResolvedButteryConfig } from "@buttery/cli";
import type { ButteryDocsGraph } from "../../../../.buttery/commands/docs/shared.types";

export const graph: ButteryDocsGraph = ${JSON.stringify(params.graph, null, 2)};
export const header: ResolvedButteryConfig<"docs">["docs"]["header"] = ${JSON.stringify(params.config.docs.header)};
`
    );
    LOG.debug("Creating data file... done");
  } catch (error) {}
}
