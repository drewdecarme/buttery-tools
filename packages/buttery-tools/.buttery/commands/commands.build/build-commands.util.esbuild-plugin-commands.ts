// import { constants, access, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "esbuild";
import * as esbuild from "esbuild";
// TODO: Remove dependency for native string literal interpolation
import handlebars from "handlebars";

import type { CommandOptionType } from "../../../lib/commands/butter-commands.types";
import type { ResolvedButteryConfig } from "../../../lib/config/getButteryConfig";
import { LOG_CLI } from "../../../lib/logger/loggers";
import { createEsbuildOptions } from "../../../lib/utils/esbuild";
import { exhaustiveMatchGuard } from "../../../lib/utils/ts/util.ts.exhaustive-match-guard";
import { kebabToCamel } from "../../../lib/utils/ts/util.ts.kebab-to-camel";
import { getCommandFiles } from "./build-commands.get-command-files";
import {
  // templateCommandParent,
  templateIndex
} from "./build-commands.templates";
import type {
  CommandFile,
  CommandGraph,
  CommandGraphProperties
} from "./build-commands.utils";

export type EntryTemplateData = {
  cli_name: string;
  cli_description: string;
  cli_version?: string;
  cli_commands: string;
};

/**
 * Dynamically import a file by cache busting the import
 * cache by adding a number representation of now. This forces
 * import to go out and fetch a new instance.
 */
export async function dynamicImport(modulePath: string) {
  // Construct a new import specifier with a unique URL timestamp query parameter
  const timestamp = new Date().getTime();
  const importSpecifier = `${modulePath}?t=${timestamp}`;

  // Import the module fresh
  return await import(importSpecifier);
}

/**
 * TODO: Update this description
 */
export class ESBuildPluginCommands {
  private config: ResolvedButteryConfig<"commands">;
  // private dirs: ButteryCLIDirectories;

  private runNumber: number;
  private commandGraph: CommandGraph;
  private programString: string;

  constructor(config: ResolvedButteryConfig<"commands">) {
    this.config = config;
    // this.dirs = getButteryCommandsDirectories(config);
    this.runNumber = 0;
    this.commandGraph = {};
    this.programString = "";
  }

  /**
   * Appends a string to the programString. Used for dynamically
   * building the program string
   */
  private appendToProgramString(str: string) {
    this.programString += str;
  }

  /**
   * Dynamically fetches the command files. Used here to re-create
   * the command files structure when things change in the command
   * files directory.
   */
  private get commandFiles() {
    return getCommandFiles(this.config);
  }

  /**
   * Creates files that might be missing from the command hierarchy
   */
  // private async ensureCommandFile(
  //   commandSegment: string,
  //   commandSegmentPathSrc: string
  // ) {
  //   const segmentCommandName = this.getCommandFileName(commandSegmentPathSrc);
  //   this.commandFiles.add(segmentCommandName);

  //   try {
  //     await access(commandSegmentPathSrc, constants.F_OK);
  //   } catch (error) {
  //     LOG_CLI.error(`Cannot locate command file for '${segmentCommandName}'`);
  //     LOG_CLI.debug("Auto creating command file with default values...");
  //     // TODO: Put any prompting behind --autofix
  //     const template = handlebars.compile<{ command_name: string }>(
  //       templateCommandParent
  //     )({ command_name: commandSegment });
  //     await writeFile(
  //       path.resolve(this.commandFilesSrcDir, `./${segmentCommandName}.ts`),
  //       template,
  //       { encoding: "utf-8" }
  //     );
  //     LOG_CLI.debug("Auto creating command file with default values... done.");
  //     LOG_CLI.warning(
  //       "A stub file has been created for you. You should ensure that you create the command in the commands dir. If you want to do this automatically then use --autofix"
  //     );
  //   }
  // }

  /**
   * Get's all of the existing command files, loops through
   * them and ensures that all of the proper files have been created
   */
  // private async validateCommandHierarchy(commandFile: CommandFile) {
  //   const { commandSegments } = commandFile;
  //   for (const commandSegmentIndex in commandFile.commandSegments) {
  //     const commandSegment = commandSegments[commandSegmentIndex];
  //     const commandSegmentName = commandSegments
  //       .slice(0, Number(commandSegmentIndex) + 1)
  //       .join(".");
  //     const commandSegmentPath = path.resolve(
  //       this.dirs.commandsDir,
  //       commandSegmentName.concat(".ts")
  //     );
  //     console.log({ commandSegmentPath });
  //     // await this.ensureCommandFile(commandSegment, commandSegmentPath);
  //   }
  // }

  /**
   * Creates a deeply nested graph of all of the commands
   * and their associated child commands. This is done
   * so that we can recursively build the commander program
   * by processing the commands key.
   */
  private async buildCommandGraph(commandFiles: CommandFile[]) {
    LOG_CLI.debug("Creating the command graph...");

    for (const { commandSegments, name, outPath } of commandFiles) {
      let currentCommandGraph = this.commandGraph;

      for (const commandSegment of commandSegments) {
        try {
          const commandFileContent = await dynamicImport(outPath);

          const properties: CommandGraphProperties = {
            meta: commandFileContent?.meta,
            segment_name: name,
            action: commandFileContent?.action,
            args: commandFileContent?.args,
            options: commandFileContent?.options
          };
          if (!currentCommandGraph[commandSegment]) {
            currentCommandGraph[commandSegment] = {
              properties,
              commands: {}
            };
          }
          currentCommandGraph = currentCommandGraph[commandSegment].commands;
        } catch (error) {
          console.log(error);

          throw new Error(error as string);
        }
      }
    }
    LOG_CLI.debug("Creating the command graph... done.");
  }

  /**a
   * Recursively builds a commander string in order to be
   * interpolated onto the index template. This string
   * recursively loops through all of the command relationships
   * in order to build the program string.
   */
  private buildProgram(cmdObj: CommandGraph, parentCmd: string) {
    const commandEntries = Object.entries(cmdObj);
    for (const [cmdName, { commands, properties }] of commandEntries) {
      const cmdVariableName = kebabToCamel(`${parentCmd}-${cmdName}`);
      const hasSubCommands = Object.values(commands).length > 0;
      this.appendToProgramString(
        `const ${cmdVariableName} = ${parentCmd}.command("${cmdName}")`
      );

      const props = properties as Partial<CommandGraphProperties>;

      // meta
      if (!props.meta) {
        throw new Error(
          `No "meta" export from command "${cmdName}". Please ensure you export a "meta" constant from the file.`
        );
      }
      this.appendToProgramString(`.description("${props.meta.description}")`);

      // args
      const commandArgs = props.args ?? [];
      for (const arg of commandArgs) {
        const argName = arg.required ? `<${arg.name}>` : `[${arg.name}]`;
        this.appendToProgramString(
          `.argument(${argName}, ${arg.description}, ${arg.defaultValue})`
        );
      }

      // options
      const commandOptions = props.options ?? {};
      const commandOptionEntires =
        Object.entries<CommandOptionType>(commandOptions);
      for (const [flag, option] of commandOptionEntires) {
        switch (option.type) {
          case "number":
          case "value": {
            this.appendToProgramString(`.option(
                  "-${option.alias}, --${flag} <value>",
                  "${option.description}"
                )`);
            break;
          }

          case "boolean": {
            this.appendToProgramString(`.option(
                  "-${option.alias}, --${flag}",
                 "${option.description}"
                )`);
            break;
          }

          default:
            exhaustiveMatchGuard(option);
        }
      }

      if (!hasSubCommands) {
        this.appendToProgramString(
          `.action(withParsedAction("${props.segment_name}"))`
        );
      }

      if (!hasSubCommands && !props.action) {
        // no sub commands on this command... an action should exist.
        LOG_CLI.warning(
          `"${props.segment_name}" missing an action export. Please export an action.`
        );
      }

      // recurse with the sub commands
      if (hasSubCommands) {
        this.appendToProgramString(";");
        this.buildProgram(commands, cmdVariableName);
      }

      this.appendToProgramString(";");
    }
  }

  private logRebuild() {
    this.runNumber++;
    LOG_CLI.debug(`Building program x${this.runNumber}...`);
  }

  private logBuildComplete() {
    LOG_CLI.success(`Building program x${this.runNumber}... complete.`);
  }

  getPlugin(): Plugin {
    let commandFiles: CommandFile[] = [];

    return {
      name: "commands",
      setup: (build) => {
        build.onStart(async () => {
          this.logRebuild();
          commandFiles = await this.commandFiles;
        });

        /**
         * The below regex does filters all of the included build files that adhere to the following:
         *
         * 1. Any file that is the immediate descendant of the commands folder and doesn't begin with an underscore.
         * 2. Any file that ends with command.
         * 3. Any file that is one level deep within the commands folder and ends with command.ts.
         *
         * We're filtering all of the build files that esbuild will use to build so we can ensure that
         * we have created the correct files for a complete command graph.
         * @see this.validateCommandHierarchy
         */
        // build.onLoad(
        //   {
        //     filter:
        //       /\/(commands\/[^/_][^/]*$|.*command$|commands\/[^/]+\/command\.ts$)/,
        //   },
        //   async (args) => {
        //     const commandFile = commandFiles.find(
        //       (commandFile) => commandFile.inPath === args.path
        //     );
        //     if (!commandFile) {
        //       throw "Cannot locate command file to process. This most likely happened due to the ESBuild onLoad regex doesn't match the command files that we're originally found.";
        //     }
        //     await this.validateCommandHierarchy(commandFile);
        //     return undefined;
        //   }
        // );
        build.onEnd(async () => {
          // 2. get all of the command files and then parse them
          await this.buildCommandGraph(commandFiles);

          // // build the command program
          this.buildProgram(this.commandGraph, "program");

          // // 4. Read the entry template and compile it with the data
          const entryTemplate = templateIndex;
          const entryTemplateData: EntryTemplateData = {
            cli_name: this.config.commands.name,
            cli_description: this.config.commands.description,
            cli_version: this.config.commands.version,
            cli_commands: this.programString
          };

          // // Reset some internally tracked values
          this.commandGraph = {};
          this.programString = "";
          // // Compile the template using handlebars
          const template = handlebars.compile<EntryTemplateData>(entryTemplate);
          const templateResult = template(entryTemplateData);

          // Build the template using the stdIn VModule for esbuild
          // https://esbuild.github.io/api/#stdin
          await esbuild.build({
            ...createEsbuildOptions({
              stdin: {
                contents: templateResult,
                loader: "ts"
              },
              outfile: path.resolve(this.config.paths.rootDir, "./bin/index.js")
            }),
            bundle: true,
            minify: true,
            external: ["commander"] // externalize commander
          });
          this.logBuildComplete();
        });
      }
    };
  }
}
