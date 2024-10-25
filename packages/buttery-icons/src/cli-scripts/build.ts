import { parseAndValidateOptions } from "@buttery/core/utils/node";
import type { z } from "zod";
import { copyStaticDir } from "../copy-static-dir";
import { generateComponents } from "../generate-components";
import { generateTypes } from "../generate-types";
import { getButteryIconsConfig } from "../getButteryIconsConfig";
import { getButteryIconsDirectories } from "../getButteryIconsDirectories";
import { getSVGFilePaths } from "../getSVGFilePaths";
import { LOG } from "../utils";
import { butteryIconsBuildOptionsSchema } from "./_options.schema";

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

  LOG.level = parsedOptions.logLevel;
  LOG.level;

  try {
    LOG.loadingStart("Building @buttery/icons");
    const config = await getButteryIconsConfig({
      prompt: parsedOptions.prompt,
    });
    const dirs = await getButteryIconsDirectories(config);

    const svgFilePaths = await getSVGFilePaths(dirs);

    if (svgFilePaths.length === 0) {
      throw `No SVGs currently in "${dirs.io.svg}". Please add some.`;
    }

    // copy the library files to the output directory
    await copyStaticDir(dirs);

    //  create the components
    await generateComponents(dirs);

    // create types
    await generateTypes(dirs);
    LOG.loadingEnd("complete!");
  } catch (error) {
    throw LOG.fatal(
      new Error(`Error when trying to build @buttery/icons: ${error}`)
    );
  }
}
