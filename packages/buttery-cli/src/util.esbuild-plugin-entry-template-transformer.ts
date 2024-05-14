import type { Plugin } from "esbuild";
import { readFile, writeFile } from "fs/promises";
import { glob } from "glob";
import handlebars from "handlebars";
import path, { dirname } from "path";
import {
  CLIConfig,
  CommandAction,
  CommandArgs,
  CommandMeta,
  CommandOptions,
} from "../lib";
import { exhaustiveMatchGuard } from "./util.parse-command-file-properties";
import { createEsbuildOptions } from "./config.esbuild";
import * as esbuild from "esbuild";
import { fileURLToPath } from "node:url";

export type EntryTemplateData = {
  cli_name: string;
  cli_description: string;
  cli_version?: string;
  cli_commands: string;
};

type CommandProperties = {
  segment_name: string;
  path: string;
  meta: CommandMeta;
  options?: CommandOptions;
  args?: CommandArgs;
  action?: CommandAction;
};

type CommandObject = {
  [key: string]: {
    properties: {};
    commands: CommandObject;
  };
};

/**
 * TODO: Update this description
 */
export class ESBuildPluginEntryTemplateTransformer {
  config: CLIConfig;
  private runNumber: number;
  private commandFileProperties: Record<string, Record<string, unknown>>;
  private commandGraph: CommandObject;
  private commandStr: string;

  constructor(config: CLIConfig) {
    this.config = config;
    this.runNumber = 0;
    this.commandFileProperties = {};
    this.commandGraph = {};
    this.commandStr = "";
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
  private get commandFilesDir() {
    return path.resolve(this.config.root, "./commands");
  }

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

  private async ensureCommandFile(
    commandSegment: string,
    commandSegmentPath: string
  ) {
    const segmentCommandName = this.getCommandFileName(commandSegmentPath);
    try {
      const segmentCommandProperties = await this.importCommand(
        commandSegmentPath
      );

      this.commandFileProperties[segmentCommandName] = {
        segment_name: segmentCommandName,
        path: commandSegmentPath,
        meta: segmentCommandProperties?.meta,
        options: segmentCommandProperties?.options,
        args: segmentCommandProperties?.args,
        action: segmentCommandProperties?.action,
      };
    } catch (error) {
      console.info(`Cannot locate command file for '${segmentCommandName}'`);
      console.log("Auto creating command file with default values...");
      // TODO: Put any prompting behind --autofix
      const commandParentTemplate = await readFile(
        path.resolve(
          import.meta.dirname,
          "../templates/template.command-parent.hbs"
        ),
        { encoding: "utf-8" }
      );
      const template = handlebars.compile<{ command_name: string }>(
        commandParentTemplate.toString()
      )({ command_name: commandSegment });
      await writeFile(
        path.resolve(this.commandFilesDir, `./${segmentCommandName}.ts`),
        template,
        { encoding: "utf-8" }
      );
      console.log("Auto creating command file with default values... done.");
      console.warn(
        "A stub file has been created for you. You should ensure that you create the command in the commands dir. If you want to do this automatically then use --autofix"
      );
      const segmentCommandProperties = await import(commandSegmentPath);
      this.commandFileProperties[segmentCommandName] = {
        segment_name: segmentCommandName,
        path: commandSegmentPath,
        meta: segmentCommandProperties?.meta,
      };
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
      const commandSegmentPath = `${this.commandFilesDir}/${commandSegmentName}.ts`;
      await this.ensureCommandFile(commandSegment, commandSegmentPath);
    }
  }

  /**
   * Creates a deeply nested graph of all of the commands
   * and their associated child commands. This is done
   * so that we can recursively build the commander program
   * by processing the commands key.
   */
  private createCommandGraph() {
    Object.keys(this.commandFileProperties).forEach((commandFileName) => {
      const commandSegments = commandFileName.split(".");
      let currentCommandGraph = this.commandGraph;

      commandSegments.forEach((segment, segmentIndex, origArr) => {
        const segmentName = origArr
          .slice(0, Number(segmentIndex) + 1)
          .join(".");

        if (!currentCommandGraph[segment]) {
          currentCommandGraph[segment] = {
            properties: this.commandFileProperties[segmentName],
            commands: {},
          };
        }
        currentCommandGraph = currentCommandGraph[segment].commands;
      });
    });
  }

  /**
   * Recursively builds a commander string in order to be
   * interpolated onto the index template. This string
   * recursively loops through all of the command relationships
   * in order to build the program string.
   */
  private buildProgram(cmdObj: CommandObject, parentCmd: string) {
    Object.entries(cmdObj).forEach(([cmdName, { commands, properties }]) => {
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
      commandArgs.forEach((arg) => {
        const argName = arg.required ? `<${arg.name}>` : `[${arg.name}]`;
        this.appendCommandStr(
          `.argument(${argName}, ${arg.description}, ${arg.defaultValue})`
        );
      });

      // options
      const commandOptions = props.options ?? {};
      Object.entries(commandOptions).forEach(([flag, option]) => {
        switch (option.type) {
          case "value": {
            return this.appendCommandStr(`.option(
                  "-${option.alias}, --${flag} <value>",
                  "${option.description}"
                )`);
          }

          case "boolean": {
            return this.appendCommandStr(`.option(
                  "-${option.alias}, --${flag}",
                 "${option.description}"
                )`);
          }

          default:
            exhaustiveMatchGuard(option);
            return;
        }
      });

      // no sub commands on this command... an action should exist.
      if (!hasSubCommands) {
        const commandAction = props.action ?? undefined;
        if (commandAction) {
          this.appendCommandStr(
            `.action(withParsedAction("${props.segment_name}"))`
          );
        } else {
          console.warn(
            `"${props.segment_name}" missing an action export. Please export an action.`
          );
        }
      }

      this.appendCommandStr(";");

      return this.buildProgram(commands, cmdVariableName);
    });
  }

  private logRebuild() {
    this.runNumber++;
    console.log(`Building program x${this.runNumber}...`);
  }

  private logBuildComplete() {
    console.log(`Building program x${this.runNumber}... complete.`);
  }

  getPlugin(): Plugin {
    const config = this.config;

    return {
      name: "entry-template-transformer",
      setup: (build) => {
        build.onStart(() => {
          this.logRebuild();
        });
        build.onLoad({ filter: /\.(ts)$/ }, async (args) => {
          // 1. ensure all of the command files exist
          await this.ensureCommandHierarchy(args.path);

          // TODO: Only do this on --local
          // const srcDir = import.meta.dirname;
          // const srcFilesGlob = path.resolve(srcDir, "./**.ts");
          // const srcFiles = glob.sync(srcFilesGlob, { follow: false });

          return undefined;
        });
        build.onEnd(async () => {
          this.logBuildComplete();

          // 2. get all of the command files and then parse them
          this.createCommandGraph();

          // // 3. build a program by iterating over each file using reduce (since all of the data will have been created at this point and all we're trying to do is create a string)
          this.buildProgram(this.commandGraph, "program");

          // 4. Read the entry template and compile it with the data
          const entryTemplateFile = await readFile(
            path.resolve(import.meta.dirname, "../templates/template.index.hbs")
          );
          const entryTemplate = entryTemplateFile.toString();
          const entryTemplateData: EntryTemplateData = {
            cli_name: config.name,
            cli_description: config.description,
            cli_version: config.version,
            cli_commands: this.commandStr,
          };

          // Reset some internally tracked values
          this.commandStr = "";
          this.commandGraph = {};

          // Compile the template and then build the template to the
          // correct directory
          const template = handlebars.compile<EntryTemplateData>(entryTemplate);
          const templateResult = template(entryTemplateData);

          await esbuild.build({
            ...createEsbuildOptions({
              stdin: {
                contents: templateResult,
                loader: "ts",
              },
              outfile: path.resolve(import.meta.dirname, "../bin/index.js"),
            }),
            bundle: true,
            minify: true,
            external: ["commander"], // externalize commander
          });
        });
      },
    };
  }
}
