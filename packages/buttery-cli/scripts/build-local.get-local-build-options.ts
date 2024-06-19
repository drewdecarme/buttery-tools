import type { BuildCommandsOptions } from "../.buttery/commands/cli.build/build-commands.utils";

export const getLocalBuildOptions = () => {
  const args = process.argv.slice(2);
  const parsedArgs = args.reduce<BuildCommandsOptions>(
    (accum, arg) => {
      if (arg === "--watch" || arg === "-w") {
        return Object.assign({}, accum, { watch: true });
      }
      if (arg === "--local" || arg === "-l") {
        return Object.assign({}, accum, { local: true });
      }
      return accum;
    },
    {
      watch: false,
      local: false,
      autofix: false,
    }
  );
  return parsedArgs;
};
