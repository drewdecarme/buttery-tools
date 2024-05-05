import { readFile, writeFile } from "fs/promises";
import { BuildScriptArgs } from "./script.build";
import handlebars from "handlebars";
import path from "path";

const __dirname = import.meta.dirname;

/**
 * Finds, compiles and then interpolates the handlebars
 * entry file template. This template is the hashbang index
 * file that that node looks for to instantiate the CLI
 * that is being created.
 */
export const compileEntryTemplate = async ({
  config,
}: Pick<BuildScriptArgs, "config">) => {
  try {
    const entryTemplateFile = await readFile(
      path.resolve(__dirname, "./template.index.hbs")
    );
    const template = handlebars.compile<{ cli_name: string }>(
      entryTemplateFile.toString()
    )({
      cli_name: config.name,
    });
    await writeFile(path.resolve(__dirname, "./index.ts"), template, "utf-8");
  } catch (error) {
    throw new Error(`Error compiling entry template: ${error}`);
  }
};
