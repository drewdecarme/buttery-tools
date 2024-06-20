import type { ButteryConfigDocs, ButteryConfigDocsOrder } from "@buttery/core";
import { parseFilename } from "./util.file.parseFilename";
import { kebabToPascalCase } from "./util.kebab-to-pascal-case";
import { LOG_DOCS } from "./util.logger";
import type { FileObj } from "./util.types";

export function orderFiles({
  docsConfig: { order },
  files,
}: {
  docsConfig: ButteryConfigDocs;
  files: FileObj[];
}): FileObj[] {
  let reconciledOrder: ButteryConfigDocsOrder;

  if (!order) {
    LOG_DOCS.warning("No custom order defined... auto ordering");

    // try to create the file order automatically
    reconciledOrder = files.reduce<ButteryConfigDocsOrder>((accum, file) => {
      const { section, route } = parseFilename(file.filename);
      if (section === "_index") return accum;
      const sectionAlreadyAdded = accum[section];
      if (!sectionAlreadyAdded) {
        return Object.assign(accum, {
          [section]: {
            display: kebabToPascalCase(section),
            routeOrder: [route],
          },
        });
      }
      const routeOrder = accum[section].routeOrder;
      // add the route
      routeOrder.push(route);
      // sort the order based upon length
      routeOrder.sort((a, b) => a.length - b.length);
      // find the section index page and move it to the front of the routeOrder
      const sectionPageIndex = routeOrder.findIndex(
        (route) => route === section
      );
      if (sectionPageIndex > -1) {
        routeOrder.unshift(routeOrder.splice(sectionPageIndex, 1)[0]);
      }
      return Object.assign(accum, {
        [section]: {
          ...accum[section],
          routeOrder,
        },
      });
    }, {});
  } else {
    reconciledOrder = order;
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
      LOG_DOCS.warning(
        `No order defined for "${file.filename}". Ordering arbitrarily.`
      );
      oFiles.push(file);
    }
  }
  return oFiles;
}
