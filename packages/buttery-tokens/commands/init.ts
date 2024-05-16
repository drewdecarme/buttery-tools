import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { CommandAction, CommandMeta, CommandOptions } from "@buttery/cli";
import { input } from "@inquirer/prompts";
import { tokenLogger } from "../utils";

export const meta: CommandMeta = {
  name: "init",
  description: "Initialize buttery tokens via a few prompts"
};

export const options: CommandOptions<"auto-fill"> = {
  "auto-fill": {
    alias: "af",
    description:
      "Runs the build with a specific logging level set to debug the build process.",
    type: "boolean",
    required: false
  }
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  tokenLogger.debug("Initializing buttery-tokens...");
  const workingDir = await input({
    message: "Where is the root of the project that you're initializing?",
    default: path.resolve(process.cwd())
  });

  try {
    // create the buttery.tokens.ts
    const outFile = path.resolve(workingDir, "./buttery-tokens.config.ts");
    const outContent = `export default {
  factor: 4
};  
`;
    tokenLogger.debug("Creating `buttery-tokens.config.ts`...");
    await writeFile(outFile, outContent, { encoding: "utf-8" });
    tokenLogger.debug("Creating `buttery-tokens.config.ts`... complete.");
    tokenLogger.success("Buttery tokens successfully initialized!");
  } catch (error) {
    const err = new Error(error);
    throw tokenLogger.fatal(err);
  }
};
