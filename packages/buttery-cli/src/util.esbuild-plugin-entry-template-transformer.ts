import type { Plugin } from "esbuild";
import { readFile, writeFile } from "fs/promises";
import { glob } from "glob";
import handlebars from "handlebars";
import path from "path";
import { CLIConfig } from "../lib";
import get from "lodash.get";
import set from "lodash.set";

type CommandFile = {
  path: string;
  hasSubCommands: boolean;
  properties: Record<string, unknown>;
};

export type EntryTemplateData = {
  cli_name: string;
  cli_description: string;
  cli_version?: string;
  cli_commands: string;
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
  private commandObj: CommandObject;
  private commandStr: string;

  constructor(config: CLIConfig) {
    this.config = config;
    this.runNumber = 0;
    this.commandFileProperties = {};
    this.commandObj = {};
    this.commandStr = "";
  }

  private kebabToCamel(kebab: string): string {
    return kebab.replace(/-([a-z0-9])/g, (_, match) => match.toUpperCase());
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
      console.log(`Importing data from "${segmentCommandName}"...`);
      const segmentCommandProperties = await import(commandSegmentPath);
      console.log(`Importing data from "${segmentCommandName}"... done.`);
      this.commandFileProperties[segmentCommandName] = {
        meta: segmentCommandProperties?.meta,
        options: segmentCommandProperties?.options,
        args: segmentCommandProperties?.args,
        action: segmentCommandProperties?.action,
      };
    } catch (error) {
      console.info(`Cannot locate command file for '${segmentCommandName}'`);
      console.log("Auto creating command file with default values...");
      // TODO: Put any prompting behind --autofix
      // TODO: NEXT STEPS!!! Move build to create commands
      const commandParentTemplate = await readFile(
        path.resolve(import.meta.dirname, "./template.command-parent.hbs"),
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
    console.log(commandFilePaths);

    commandFilePaths.forEach((commandFilePath) => {
      const commandFileName = this.getCommandFileName(commandFilePath);
      const commandSegments = commandFileName.split(".");
      let currentObj = this.commandObj;

      commandSegments.forEach((segment, segmentIndex, origArr) => {
        const segmentName = origArr
          .slice(0, Number(segmentIndex) + 1)
          .join(".");
        if (!currentObj[segment]) {
          currentObj[segment] = {
            properties: this.commandFileProperties[segmentName],
            commands: {},
          };
        }
        currentObj = currentObj[segment].commands;
      });
    }, {});
  }

  private buildProgram() {
    const parseCommand = (cmdObj: CommandObject, parentCommandName: string) => {
      Object.entries(cmdObj).forEach(([cmdName, { commands, properties }]) => {
        const wellFormedCmdName = this.kebabToCamel(cmdName);
        console.log("Parsing", wellFormedCmdName);
        const subCommands = Object.values(commands).length > 0;
        this.commandStr = this.commandStr.concat(`
const ${wellFormedCmdName} = ${parentCommandName}.command("${cmdName}");`);
        if (subCommands) {
          return parseCommand(commands, wellFormedCmdName);
        }
      });
    };

    parseCommand(this.commandObj, "program");
    console.log(this.commandStr);
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
        build.onLoad({ filter: /\.hbs$/ }, async (args) => {
          this.logBuildIteration();

          // 1. ensure all of the command files exist
          await this.ensureCommands();
          // 2. get all of the command files and then parse them
          this.parseCommands();
          // 3. build a program by iterating over each file using reduce (since all of the data will have been created at this point and all we're trying to do is create a string)
          this.buildProgram();
          // 4. Read the entry template and compile it with the data
          const entryTemplateFile = await readFile(args.path);
          const template = handlebars.compile<EntryTemplateData>(
            entryTemplateFile.toString()
          )({
            cli_name: config.name,
            cli_description: config.description,
            cli_version: config.version,
            cli_commands: this.commandStr,
          });

          // TODO: Only do this on --local
          const srcDir = import.meta.dirname;
          const srcFilesGlob = path.resolve(srcDir, "/**.ts");
          const srcFiles = glob.sync(srcFilesGlob, { follow: false });

          return {
            contents: template,
            loader: "ts",
            watchFiles: [args.path, ...srcFiles, ...this.commandFilePaths],
            watchDirs: [this.commandFilesDir],
          };
        });
      },
    };
  }
}
