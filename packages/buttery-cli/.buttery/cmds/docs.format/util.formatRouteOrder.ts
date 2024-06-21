import { LOG_DOCS } from "../docs.dev/_utils/util.logger";
import { autoOrderButteryDocFiles } from "../docs/shared.autoOrderButteryDocFiles";
import { getButteryDocsFiles } from "../docs/shared.getButteryDocFiles";
import { getButteryDocsConfig } from "../docs/shared.getButteryDocsConfig";

export async function formatRouteOrder() {
  try {
    const config = await getButteryDocsConfig();
    const files = await getButteryDocsFiles(config);
    const autoOrder = autoOrderButteryDocFiles(files);
    console.log(autoOrder);
  } catch (error) {
    throw LOG_DOCS.fatal(new Error(error as string));
  }
}
