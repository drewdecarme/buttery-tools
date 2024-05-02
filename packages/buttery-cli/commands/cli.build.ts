import { CommandAction, CommandMeta } from "../types";

export const meta: CommandMeta = {
  name: "build",
  description: "Build your file-based CLI",
};

// const explorer = cosmiconfig("buttery");

// explorer
//   .search()
//   .then(async (result) => {
//     // protect against a bad parse
//     if (!result) throw new Error("Cannot parse configuration result.");

//     const config = result.config as CLIConfig;

//     // Add the name and the description of the CLI
//     program.name(config.name).description(config.description);
//     const commandsDir = resolve(__dirname, "./commands");

//     console.log(commandsDir);

//     const commandFilePaths = glob.sync(commandsDir.concat("/*.js"), {
//       follow: false,
//     });

//     console.log(commandFilePaths);

//     await registerCommandsFromFiles(program, commandFilePaths);
//     console.log(program.opts());
//     await program.parseAsync();
//   })
//   .catch((error) => {
//     console.error(error);
//     throw new Error(error);
//   });

// TODO: Check to see if commands dir exists
// TODO: Check to see if commands dir has commands

export const action: CommandAction = async () => {
  // This is where you make the index.js file where the commands
  // will have an entry point...

  console.log("Hello from the CLI 'build' command.");
};
