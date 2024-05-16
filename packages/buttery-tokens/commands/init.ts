import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { CommandAction, CommandMeta, CommandOptions } from "@buttery/cli";
import { confirm, input, select } from "@inquirer/prompts";
import { tokenLogger } from "../utils";

export const meta: CommandMeta = {
  name: "init",
  description: "Initialize buttery tokens via a few prompts"
};

export const options: CommandOptions<"auto"> = {
  auto: {
    alias: "a",
    description:
      "Skips the prompts and initializes buttery tokens with all of the defaults",
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
  tokenLogger.info(
    "In order to ensure that your tokens don't conflict with any other variables from any other third party libraries, it's a best practice to prefix (or namespace) your variables with a prefix. This ensures that they aren't any variables that will overwrite each other which would provide unexpected results."
  );
  const prefix = await input({
    message: "Please indicate a prefix.",
    default: "buttery"
  });

  /**
   * https://www.thedesignership.com/blog/the-ultimate-spacing-guide-for-ui-designers#:~:text=The%204%2Dpoint%20grid%20system%20is%20a%20framework%20that%20helps,%2C%2016%2C%20etc.).
   */
  tokenLogger.info(
    "In order to preserve harmonious layout, you'll need to pick a grid system scalar. This ensures that all aspects of sizing in your application are in alignment."
  );
  const gridSystem = await select({
    message: "Please select a grid system below",
    choices: [4, 8, 10].map((value) => ({
      value: value.toString(),
      description: value.toString()
    })),
    default: "4"
  });

  const strictMode = await confirm({
    message: "Would you like to enable strict mode?",
    default: true
  });

  try {
    // create the buttery.tokens.ts
    const outFile = path.resolve(workingDir, "./tokens.config.ts");
    const outContent = `export default {
  gridSystem: ${gridSystem},
  prefix: "${prefix}",
  strict: ${strictMode}
};  
`;
    tokenLogger.debug("Creating `tokens.config.ts`...");
    await writeFile(outFile, outContent, { encoding: "utf-8" });
    tokenLogger.debug("Creating `tokens.config.ts`... complete.");

    tokenLogger.success("Buttery tokens successfully initialized!");
  } catch (error) {
    throw tokenLogger.fatal(new Error(error));
  }
};
