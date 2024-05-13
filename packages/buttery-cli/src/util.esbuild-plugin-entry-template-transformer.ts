import type { Plugin } from "esbuild";
import { readFile, writeFile } from "fs/promises";
import { glob } from "glob";
import handlebars from "handlebars";
import path from "path";
import { CLIConfig, CommandMeta, CommandOptions } from "../lib";

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

/**
 * TODO: Update this description
 */
export class ESBuildPluginEntryTemplateTransformer {
  config: CLIConfig;
  private runNumber: number;
  private commandFileProperties: Record<string, Record<string, unknown>>;

  constructor(config: CLIConfig) {
    this.config = config;
    this.runNumber = 0;
    this.commandFileProperties = {};
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
  private parseAndValidateCommands(): CommandFile[] {
    const commandFiles = this.commandFilePaths;
    const files = commandFiles.reduce<CommandFile[]>(
      (accum, commandFilePath) => {
        const name = path.basename(commandFilePath, ".ts");
        const hasSubCommands = !!commandFiles.find(
          (cFilePath) =>
            cFilePath !== commandFilePath && cFilePath.includes(name)
        );
        return [
          ...accum,
          {
            name,
            hasSubCommands,
            path: commandFilePath,
            properties: {},
          },
        ];
      },
      []
    );
    return files;
  }

  private buildProgramFromCommandFiles(): string {
    return "";
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
          // const commandFiles = this.parseAndValidateCommands();
          // 3. build a program by iterating over each file using reduce (since all of the data will have been created at this point and all we're trying to do is create a string)
          const commandString = this.buildProgramFromCommandFiles();
          // 4. Read the entry template and compile it with the data
          const entryTemplateFile = await readFile(args.path);
          const template = handlebars.compile<EntryTemplateData>(
            entryTemplateFile.toString()
          )({
            cli_name: config.name,
            cli_description: config.description,
            cli_version: config.version,
            cli_commands: commandString,
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
