import type { ButteryConfigDocs } from "@buttery/core";
import { LOG_DOCS } from "./util.logger";
import type { FileObj } from "./util.types";

export function orderFiles({
  docsConfig: { order },
  files,
}: {
  docsConfig: ButteryConfigDocs;
  files: FileObj[];
}): FileObj[] {
  if (!order) {
    LOG_DOCS.warning(
      "No order defined... will be outputting graph in order the files are processed."
    );
    return files;
  }

  const oFiles: FileObj[] = [];

  for (const section in order) {
    const sectionOrder = order[section].routeOrder;
    for (const sectionRoute of sectionOrder) {
      console.log(section);
      // add the section index file first
      const sectionIndexFile = files.find((file) => file.filename === section);
      const oFilesHasSectionIndexFile = oFiles.find(
        (f) => f.filename === sectionIndexFile?.filename
      );
      if (!oFilesHasSectionIndexFile && sectionIndexFile) {
        console.log({ sectionIndexFile });
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
      LOG_DOCS.debug(
        `No order defined for "${file.filename}". Ordering arbitrarily.`
      );
      oFiles.push(file);
    }
  }
  return oFiles;
}
