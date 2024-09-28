import { LOG } from "../../../lib/logger/LOG_CLI/LOG.CLI";
import { autoOrderButteryDocFiles } from "../docs/docs.autoOrderButteryDocFiles";
import { getButteryDocsFiles } from "../docs/docs.getButteryDocFiles";
import { getButteryDocsConfig } from "../docs/docs.getButteryDocsConfig";

export async function formatRouteOrder() {
  try {
    const config = await getButteryDocsConfig();
    const files = await getButteryDocsFiles(config);
    const autoOrder = autoOrderButteryDocFiles(files);
    LOG.success("Successfully auto ordered the documentation files.");

    console.log(`
Results of the auto order are below.
You can take it and paste it into the "./.buttery/config.ts", "docs.order" key.
----

${JSON.stringify(autoOrder, null, 2)}

----
`);
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
