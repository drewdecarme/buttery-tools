import type { ButteryConfigDocsOrder } from "../../config/buttery-config.types.docs";
import { LOG_CLI } from "../../logger/loggers";
import { autoOrderButteryDocFiles } from "./docs.autoOrderButteryDocFiles";
import type { ButteryDocsConfig } from "./docs.getButteryDocsConfig";
import type { FileObj } from "./docs.types";

export function orderButteryDocFiles(
  docsConfig: ButteryDocsConfig,
  files: FileObj[]
): FileObj[] {
  let reconciledOrder: ButteryConfigDocsOrder;

  if (!docsConfig.docs.order) {
    LOG_CLI.warning("No custom order defined... auto ordering");
    reconciledOrder = autoOrderButteryDocFiles(files);
  } else {
    reconciledOrder = docsConfig.docs.order;
  }

  const oFiles: FileObj[] = [];

  // loop through through the docs.order configuration property
  for (const section in reconciledOrder) {
    const sectionOrder = reconciledOrder[section].routeOrder;
    for (const sectionRoute of sectionOrder) {
      // add the section index file first
      const sectionIndexFile = files.find((file) => file.filename === section);
      const oFilesHasSectionIndexFile = oFiles.find(
        (f) => f.filename === sectionIndexFile?.filename
      );
      if (!oFilesHasSectionIndexFile && sectionIndexFile) {
        oFiles.push(sectionIndexFile);
      }

      // add the ordered file name second
      const orderedFile = files.find(
        (file) => file.filename === `${section}.${sectionRoute}`
      );
      if (orderedFile) oFiles.push(orderedFile);
    }
  }

  for (const file of files) {
    const fileAlreadyOrdered = oFiles.find(
      (oFile) => oFile.filename === file.filename
    );
    if (!fileAlreadyOrdered && file.filename === "_index") {
      // add the _index file to the beginning of the order
      oFiles.unshift(file);
    } else if (!fileAlreadyOrdered) {
      // add the un ordered files to the end of the order
      LOG_CLI.warning(
        `No order defined for "${file.filename}". Ordering arbitrarily.`
      );
      oFiles.push(file);
    }
  }
  return oFiles;
}
