import { LOG_DOCS } from "../docs.dev/_utils/util.logger";
import { autoOrderButteryDocFiles } from "../docs/shared.autoOrderButteryDocFiles";
import { getButteryDocsFiles } from "../docs/shared.getButteryDocFiles";
import { getButteryDocsConfig } from "../docs/shared.getButteryDocsConfig";

export async function formatRouteOrder() {
  try {
    const config = await getButteryDocsConfig();
    const files = await getButteryDocsFiles(config);
    const autoOrder = autoOrderButteryDocFiles(files);
    LOG_DOCS.success("Successfully auto ordered the documentation files.");

    console.log(`
Results of the auto order are below.
You can take it and paste it into the "./.buttery/config.ts", "docs.order" key.
----

${JSON.stringify(autoOrder, null, 2)}

----
`);
  } catch (error) {
    throw LOG_DOCS.fatal(new Error(error as string));
  }
}
