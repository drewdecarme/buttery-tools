import { CommandAction, CommandMeta } from "../lib/types";
import { program } from "commander";
import { cosmiconfig } from "cosmiconfig";
import { glob } from "glob";
import { CLIConfig } from "../lib/types";
import { registerCommandsFromFiles } from "../src/process-command-dir.js";
export const meta: CommandMeta = {
  name: "cli",
  description: "Build your file-based CLI",
};

export const action: CommandAction = async () => {
  console.log("Building your files...");
  const explorer = cosmiconfig("butter");

  explorer
    .search()
    .then(async (result) => {
      // protect against a bad parse
      if (!result) throw new Error("Cannot parse configuration result.");

      const config = result.config as CLIConfig;

      // Add the name and the description of the CLI
      program.name(config.name).description(config.description);

      const commandFilePaths = glob.sync(`${config.root}/bin/commands/*.js`, {
        follow: false,
      });
      registerCommandsFromFiles(program, commandFilePaths);
      program.parse(process.argv);
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });
};
