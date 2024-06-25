import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CommandAction, CommandMeta, CommandOptions } from "@buttery/cli";
import { getButteryConfig } from "@buttery/core";
import { getButteryTokensDirectories } from "../tokens/tokens.util.getButteryTokensDirectories";
import { buildFunctionsAndTokens } from "./utils/tokens.build.buildFunctionsAndTokens";
import { tokenLogger } from "./utils/util.logger";

export const meta: CommandMeta = {
  name: "build",
  description: "Run the buttery-tokens CLI in watch mode.",
};

export const options: CommandOptions<"debug" | "watch" | "interactive"> = {
  debug: {
    alias: "d",
    description:
      "Runs the build with a specific logging level set to debug the build process.",
    type: "boolean",
    required: false,
  },
  watch: {
    alias: "w",
    description:
      "Runs the build in development mode. Any changes to commands will rebuild the CLI",
    type: "boolean",
    required: false,
  },
  interactive: {
    alias: "i",
    description:
      "Runs the playground to visually view and edit the tokens configuration",
    type: "boolean",
    required: false,
  },
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  tokenLogger.debug("Building buttery tokens...");

  const config = await getButteryConfig("tokens");
  const dirs = await getButteryTokensDirectories(config);

  // create a unique directory in the working directory
  // make a working dir we can always expect in any resolved tokens
  // directory. This working dir will enable us to build some files to
  // make imports work the way we want to.
  await mkdir(dirs.working.path, { recursive: true });

  // write the files needed to import from another library
  const importFileContent = `export * from "./${path.relative(dirs.package, dirs.working.path)}/index.js";\n`;
  const tsConfigFileContent = JSON.stringify(
    { extends: "@buttery/tsconfig/library" },
    null,
    2
  );
  await Promise.all([
    writeFile(dirs.templateTSConfig, tsConfigFileContent),
    ...[".js", ".d.ts"].map((extension) =>
      writeFile(
        path.resolve(dirs.package, dirs.working.name.concat(extension)),
        importFileContent
      )
    ),
  ]);

  // TODO: Add source and transpile files to this directory
  await buildFunctionsAndTokens(config, dirs, {
    watch: Boolean(options.watch),
    interactive: Boolean(options.interactive),
  });

  tokenLogger.success("Build complete!");
};
