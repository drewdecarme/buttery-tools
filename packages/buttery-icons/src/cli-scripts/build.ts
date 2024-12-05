import { parseAndValidateOptions } from "@buttery/core/utils/node";
import type { z } from "zod";

import { butteryIconsBuildOptionsSchema } from "./_options.schema";

import { copyStaticDir } from "../build/copy-static-dir";
import { generateComponents } from "../build/generate-components";
import { generateTypes } from "../build/generate-types";
import { getButteryIconsConfig } from "../config/getButteryIconsConfig";
import { getSVGFilePaths } from "../build/getSVGFilePaths";
import { LOG } from "../utils/util.logger";

export type ButteryIconsBuildOptions = z.infer<
  typeof butteryIconsBuildOptionsSchema
>;

/**
 * Build the raw SVGs contained in your pre-defined
 * svg directory into React Components so they can be
 * dynamically imported and typed using a standard
 * component
 */
export async function build(options?: ButteryIconsBuildOptions) {
  const parsedOptions = parseAndValidateOptions(
    butteryIconsBuildOptionsSchema,
    options,
    LOG
  );

  // set the level of logging based upon the parsed options
  LOG.level = parsedOptions.logLevel;

  try {
    LOG.loadingStart("Building @buttery/icons");
    const rConfig = await getButteryIconsConfig(parsedOptions);

    const svgFilePaths = await getSVGFilePaths(rConfig.dirs);

    if (svgFilePaths.length === 0) {
      throw `No SVGs currently in "${rConfig.dirs.svg}". Please add some.`;
    }

    // copy the library files to the output directory
    await copyStaticDir(rConfig.dirs);

    //  create the components
    await generateComponents(rConfig.dirs);

    // create types
    await generateTypes(rConfig.dirs);
    LOG.loadingEnd("complete!");
  } catch (error) {
    LOG.loadingEnd("");
    LOG.fatal(new Error(`Error when trying to build @buttery/icons: ${error}`));
  }
}
