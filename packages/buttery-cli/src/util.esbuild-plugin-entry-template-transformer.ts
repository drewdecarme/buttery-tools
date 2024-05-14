import type { Plugin } from "esbuild";
import { readFile, writeFile } from "fs/promises";
import { glob } from "glob";
import handlebars from "handlebars";
import path from "path";
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

export type EntryTemplateData = {
  cli_name: string;
  cli_description: string;
  cli_version?: string;
  cli_commands: string;
};

type CommandProperties = {
  segment_name: string;
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

  /**
   * Returns all of the command file paths in the commands directory
   * set from the `buttery.config`
   */
  private get commandFilePaths() {
    const commandFilesGlob = path.resolve(this.commandFilesDir, "./**.ts");
    const commandFiles = glob.sync(commandFilesGlob, { follow: false });
    return commandFiles;
  }

  private getCommandFileName(commandFilePath: string) {
    return path.basename(commandFilePath, ".ts");
  }

  private async ensureCommandFile(
    commandSegment: string,
    commandSegmentPath: string
  ) {
    const segmentCommandName = this.getCommandFileName(commandSegmentPath);
    try {
      const segmentCommandProperties = await import(commandSegmentPath);
      // if (segmentCommandName === "cli.build") {
      //   console.log({
      //     segmentCommandName,
      //     commandSegmentPath,
      //     properties: segmentCommandProperties,
      //   });
      // }
      this.commandFileProperties[segmentCommandName] = {
        segment_name: segmentCommandName,
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
        path.resolve(this.commandFilesDir, `./${segmentCommandName}.js`),
        template,
        { encoding: "utf-8" }
      );
      console.log("Auto creating command file with default values... done.");
      console.warn(
        "A stub file has been created for you. You should ensure that you create the command in the commands dir. If you want to do this automatically then use --autofix"
      );
      const segmentCommandProperties = await import(commandSegmentPath);
      this.commandFileProperties[segmentCommandName] = {
        meta: segmentCommandProperties?.meta,
      };
    }
  }

  /**
   * Get's all of the existing command files, loops through
   * them and ensures that all of the proper files have been created
   */
  private async ensureCommands() {
    const commandFilePaths = this.commandFilePaths;

    for (const commandFilePathIndex in commandFilePaths) {
      const commandFilePath = commandFilePaths[commandFilePathIndex];
      const commandFileName = this.getCommandFileName(commandFilePath);
      const commandSegments = commandFileName.split(".");

      for (const commandSegmentIndex in commandSegments) {
        const commandSegment = commandSegments[commandSegmentIndex];
        const commandSegmentName = commandSegments
          .slice(0, Number(commandSegmentIndex) + 1)
          .join(".");
        const commandSegmentPath = `${this.commandFilesDir}/${commandSegmentName}`;
        await this.ensureCommandFile(commandSegment, commandSegmentPath);
      }
    }
  }

  /**
   * Parses all of the commandFiles and then returns the result
   */
  private parseCommands() {
    const commandFilePaths = this.commandFilePaths;

    commandFilePaths.forEach((commandFilePath) => {
      const commandFileName = this.getCommandFileName(commandFilePath);
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

  private logBuildIteration() {
    console.log(`Compiling template x${this.runNumber}`);
    this.runNumber++;
  }

  getPlugin(): Plugin {
    const config = this.config;

    return {
      name: "entry-template-transformer",
      setup: (build) => {
        build.onResolve({ filter: /\.(ts)$/ }, async (args) => {
          console.log("resolving commands", args);
          return {
            pluginData: { test: "" },
          };
        });

        build.onLoad({ filter: /\.(hbs|ts)$/ }, async (args) => {
          console.log({ onLoad: "hbs|ts", args });

          // 1. ensure all of the command files exist
          await this.ensureCommands();
          // 2. get all of the command files and then parse them
          this.parseCommands();
          // // 3. build a program by iterating over each file using reduce (since all of the data will have been created at this point and all we're trying to do is create a string)
          // this.buildProgram();
          // // 4. Read the entry template and compile it with the data
          // const entryTemplateFile = await readFile(
          //   path.resolve(import.meta.dirname, "../templates/template.index.hbs")
          // );
          // const entryTemplate = entryTemplateFile.toString();
          // const entryTemplateData: EntryTemplateData = {
          //   cli_name: config.name,
          //   cli_description: config.description,
          //   cli_version: config.version,
          //   cli_commands: this.commandStr,
          // };
          // const template = handlebars.compile<EntryTemplateData>(entryTemplate);
          // const templateResult = template(entryTemplateData);

          // TODO: Only do this on --local
          const srcDir = import.meta.dirname;
          const srcFilesGlob = path.resolve(srcDir, "./**.ts");
          const srcFiles = glob.sync(srcFilesGlob, { follow: false });

          return {
            contents: "",
            loader: "ts",
            watchFiles: [args.path, ...srcFiles, ...this.commandFilePaths],
            watchDirs: [this.commandFilesDir],
          };
        });
        build.onEnd(async () => {
          this.logBuildIteration();

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

          const template = handlebars.compile<EntryTemplateData>(entryTemplate);
          const templateResult = template(entryTemplateData);
          console.log(templateResult);

          await esbuild.build({
            ...createEsbuildOptions({
              stdin: {
                contents: templateResult,
                sourcefile: "index.js",
                loader: "ts",
              },
              outfile: path.resolve(import.meta.dirname, "../bin/index.js"),
            }),
            bundle: true,
            minify: true,
            external: ["commander"],
          });
        });
      },
    };
  }
}
