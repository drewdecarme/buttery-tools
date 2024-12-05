import path from "node:path";

export type ButteryCommandsDirectories = ReturnType<
  typeof getButteryCommandsDirectories
>;

export const getButteryCommandsDirectories = (
  config: ResolvedButteryConfig<"commands">
) => {
  const commandsDirName = config.commands.commandsDir ?? "commands";
  const binDir = path.resolve(config.paths.rootDir, "./bin");
  return {
    commandsDir: path.resolve(config.paths.butteryDir, `./${commandsDirName}`),
    packageJson: path.resolve(config.paths.rootDir, "./package.json"),
    binDir,
    outDir: path.resolve(binDir, "./commands"),
  };
};
