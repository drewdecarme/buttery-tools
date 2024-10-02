import { autoOrderButteryDocFiles } from "../../../lib/docs/docs.autoOrderButteryDocFiles";
import { getButteryDocsFiles } from "../../../lib/docs/docs.getButteryDocFiles";
import { getButteryDocsConfig } from "../../../lib/docs/docs.getButteryDocsConfig";
import { LOG_CLI } from "../../../lib/logger/loggers";

export async function formatRouteOrder() {
  try {
    const config = await getButteryDocsConfig();
    const files = await getButteryDocsFiles(config);
    const autoOrder = autoOrderButteryDocFiles(files);
    LOG_CLI.success("Successfully auto ordered the documentation files.");

    console.log(`
Results of the auto order are below.
You can take it and paste it into the "./.buttery/config.ts", "docs.order" key.
----

${JSON.stringify(autoOrder, null, 2)}

----
`);
  } catch (error) {
    throw LOG_CLI.fatal(new Error(error as string));
  }
}
