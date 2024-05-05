import type { Plugin } from "esbuild";
import { compileEntryTemplate } from "./util.compile-entry-template";
import { readFile } from "fs/promises";
import handlebars from "handlebars";

export type EntryTemplateData = {
  cli_name: string;
};

/**
 * This class helps create a plugin for esbuild that
 * looks for any handlebars templates, compiles them
 * with the data that it needs. It then transforms them
 * into a TypeScript file. When the build is run in
 * watch mode, we listen to the handlebars template changes
 * to then recompile them and print them to their destination
 * (all defined in the esbuild itself and not the plugin)
 */
export class ESBuildPluginEntryTemplateTransformer {
  data: EntryTemplateData;

  constructor(data: EntryTemplateData) {
    this.data = data;
  }

  getPlugin(): Plugin {
    const data = this.data;

    return {
      name: "entry-template-transformer",
      setup(build) {
        // Load ".txt" files and return an array of words
        build.onLoad({ filter: /\.hbs$/ }, async (args) => {
          const entryTemplateFile = await readFile(args.path);
          const template = handlebars.compile<EntryTemplateData>(
            entryTemplateFile.toString()
          )(data);
          return {
            contents: template,
            loader: "ts",
            watchFiles: [args.path],
          };
        });
      },
    };
  }
}
