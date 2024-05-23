import { constants, access, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ButteryConfigBase, ButteryConfigCli } from "@buttery/core";
import { createEsbuildOptions } from "@buttery/utils/esbuild";
import { exhaustiveMatchGuard } from "@buttery/utils/ts";
import type { Plugin } from "esbuild";
import * as esbuild from "esbuild";
// TODO: Remove dependency for native string literal interpolation
import handlebars from "handlebars";
import type {
  CommandAction,
  CommandArgs,
  CommandMeta,
  CommandOptions
} from "../../lib";
import { LOG } from "../_utils/util.logger";
import { templateCommandParent, templateIndex } from "./template";

export type EntryTemplateData = {
  cli_name: string;
  cli_description: string;
  cli_version?: string;
  cli_commands: string;
};

type CommandProperties = {
  segment_name: string;
  meta: CommandMeta;
  options?: CommandOptions<"">;
  args?: CommandArgs;
  action?: CommandAction;
};

type CommandObject = {
  [key: string]: {
    // biome-ignore lint/complexity/noBannedTypes: Don't really care too much about this
    properties: {};
    commands: CommandObject;
  };
};

/**
 * TODO: Update this description
 */
export class ESBuildPluginCommands {
  private config: ButteryConfigBase & ButteryConfigCli;
  private runNumber: number;
  private commandFilesSrcDir: string;
  private commandFilesOutDir: string;
  private commandFiles: Set<string>;
  private commandGraph: CommandObject;
  private commandStr: string;

  constructor(config: ButteryConfigBase & ButteryConfigCli) {
    this.config = config;
    this.runNumber = 0;
    this.commandFiles = new Set();
    this.commandGraph = {};
    this.commandStr = "";

    this.commandFilesSrcDir = path.resolve(this.config.root, "./commands");
    this.commandFilesOutDir = path.resolve(this.config.root, "./bin/commands");
  }

  private kebabToCamel(kebab: string): string {
    return kebab.replace(/-([a-z0-9])/g, (_, match) => match.toUpperCase());
  }

  private appendCommandStr(str: string) {
    this.commandStr += str;
  }

  /**
   * Returns the commands directory path that was configured
   * by the `buttery.config`
   */

  private getCommandFileName(commandFilePath: string) {
    return path.basename(commandFilePath, ".ts");
  }

  /**
   * Dynamically import a command by cache busting the import
   * cache by adding a number representation of now. This forces
   * import to go out and fetch a new instance.
   */
  private async importCommand(modulePath: string) {
    // Construct a new import specifier with a unique URL timestamp query parameter
    const timestamp = new Date().getTime();
    const importSpecifier = `${modulePath}?t=${timestamp}`;

    // Import the module fresh
    return await import(importSpecifier);
  }

  /**
   * Creates files that might be missing from the command hierarchy
   */
  private async ensureCommandFile(
    commandSegment: string,
    commandSegmentPathSrc: string
  ) {
    const segmentCommandName = this.getCommandFileName(commandSegmentPathSrc);
    this.commandFiles.add(segmentCommandName);

    try {
      await access(commandSegmentPathSrc, constants.F_OK);
    } catch (error) {
      LOG.error(`Cannot locate command file for '${segmentCommandName}'`);
      LOG.debug("Auto creating command file with default values...");
      // TODO: Put any prompting behind --autofix
      const template = handlebars.compile<{ command_name: string }>(
        templateCommandParent
      )({ command_name: commandSegment });
      await writeFile(
        path.resolve(this.commandFilesSrcDir, `./${segmentCommandName}.ts`),
        template,
        { encoding: "utf-8" }
      );
      LOG.debug("Auto creating command file with default values... done.");
      LOG.warning(
        "A stub file has been created for you. You should ensure that you create the command in the commands dir. If you want to do this automatically then use --autofix"
      );
    }
  }

  /**
   * Get's all of the existing command files, loops through
   * them and ensures that all of the proper files have been created
   */
  private async ensureCommandHierarchy(commandFilePath: string) {
    const commandFileName = this.getCommandFileName(commandFilePath);
    const commandSegments = commandFileName.split(".");

    for (const commandSegmentIndex in commandSegments) {
      const commandSegment = commandSegments[commandSegmentIndex];
      const commandSegmentName = commandSegments
        .slice(0, Number(commandSegmentIndex) + 1)
        .join(".");
      const commandSegmentPath = `${this.commandFilesSrcDir}/${commandSegmentName}.ts`;
      await this.ensureCommandFile(commandSegment, commandSegmentPath);
    }
  }

  /**
   * Creates a deeply nested graph of all of the commands
   * and their associated child commands. This is done
   * so that we can recursively build the commander program
   * by processing the commands key.
   */
  private async createCommandGraph() {
    LOG.debug("Creating the command graph...");
    const commandFiles = [...this.commandFiles.values()];

    for (const commandFileName of commandFiles) {
      const commandSegments = commandFileName.split(".");
      let currentCommandGraph = this.commandGraph;

      for (const commandSegment of commandSegments) {
        try {
          const commandFilePath = path.resolve(
            this.commandFilesOutDir,
            `./${commandFileName}.js`
          );
          const commandFileContent = await this.importCommand(commandFilePath);
          const properties: CommandProperties = {
            meta: commandFileContent?.meta,
            segment_name: commandFileName,
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
          const err = new Error(error as string);
          LOG.fatal(err);
          throw err;
        }
      }
    }
    LOG.debug("Creating the command graph... done.");
  }

  /**
   * Recursively builds a commander string in order to be
   * interpolated onto the index template. This string
   * recursively loops through all of the command relationships
   * in order to build the program string.
   */
  private buildCommands(cmdObj: CommandObject, parentCmd: string) {
    const commandEntries = Object.entries(cmdObj);
    for (const [cmdName, { commands, properties }] of commandEntries) {
      const cmdVariableName = this.kebabToCamel(cmdName);
      const hasSubCommands = Object.values(commands).length > 0;
      this.appendCommandStr(
        `const ${cmdVariableName} = ${parentCmd}.command("${cmdName}")`
      );

      const props = properties as CommandProperties;

      // meta
      this.appendCommandStr(`.description("${props.meta.description}")`);

      // args
      const commandArgs = props.args ?? [];
      for (const arg of commandArgs) {
        const argName = arg.required ? `<${arg.name}>` : `[${arg.name}]`;
        this.appendCommandStr(
          `.argument(${argName}, ${arg.description}, ${arg.defaultValue})`
        );
      }

      // options
      const commandOptions = props.options ?? ({} as CommandOptions<"">);
      const commandOptionEntires = Object.entries(commandOptions);
      for (const [flag, option] of commandOptionEntires) {
        switch (option.type) {
          case "value": {
            this.appendCommandStr(`.option(
                  "-${option.alias}, --${flag} <value>",
                  "${option.description}"
                )`);
            break;
          }

          case "boolean": {
            this.appendCommandStr(`.option(
                  "-${option.alias}, --${flag}",
                 "${option.description}"
                )`);
            break;
          }

          default:
            exhaustiveMatchGuard(option);
            break;
        }
      }

      if (!hasSubCommands) {
        this.appendCommandStr(
          `.action(withParsedAction("${props.segment_name}"))`
        );
      }

      if (!hasSubCommands && !props.action) {
        // no sub commands on this command... an action should exist.
        LOG.warning(
          `"${props.segment_name}" missing an action export. Please export an action.`
        );
      }

      // recurse with the sub commands
      if (hasSubCommands) {
        this.appendCommandStr(";");
        this.buildCommands(commands, cmdVariableName);
      }

      this.appendCommandStr(";");
    }
  }

  private logRebuild() {
    this.runNumber++;
    LOG.debug(`Building program x${this.runNumber}...`);
  }

  private logBuildComplete() {
    LOG.success(`Building program x${this.runNumber}... complete.`);
  }

  getPlugin(): Plugin {
    const config = this.config;

    return {
      name: "commands",
      setup: (build) => {
        build.onStart(() => {
          this.logRebuild();
        });
        build.onLoad({ filter: /\/commands\/.*\.ts$/ }, async (args) => {
          // 1. ensure all of the command files exist
          await this.ensureCommandHierarchy(args.path);

          // TODO: Only do this on --local
          // const srcDir = import.meta.dirname;
          // const srcFilesGlob = path.resolve(srcDir, "./**.ts");
          // const srcFiles = glob.sync(srcFilesGlob, { follow: false });

          return undefined;
        });
        build.onEnd(async () => {
          // 2. get all of the command files and then parse them
          await this.createCommandGraph();

          // // 3. build a program by iterating over each file using reduce (since all of the data will have been created at this point and all we're trying to do is create a string)
          this.buildCommands(this.commandGraph, "program");

          // 4. Read the entry template and compile it with the data
          const entryTemplate = templateIndex;
          const entryTemplateData: EntryTemplateData = {
            cli_name: config.name,
            cli_description: config.description,
            cli_version: config.version,
            cli_commands: this.commandStr
          };

          // Reset some internally tracked values
          this.commandGraph = {};
          this.commandStr = "";

          // Compile the template and then build the template to the
          // correct directory
          const template = handlebars.compile<EntryTemplateData>(entryTemplate);
          const templateResult = template(entryTemplateData);

          await esbuild.build({
            ...createEsbuildOptions({
              stdin: {
                contents: templateResult,
                loader: "ts"
              },
              outfile: path.resolve(this.config.root, "./bin/index.js")
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
