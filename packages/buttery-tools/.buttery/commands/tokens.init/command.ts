import { writeFile } from "node:fs/promises";
import path from "node:path";
import { confirm, input, select } from "@inquirer/prompts";
import type {
  CommandAction,
  CommandMeta,
  CommandOptions
} from "../../../lib/buttery-commands";
import { LOG } from "../_logger/util.ts.logger";

export const meta: CommandMeta = {
  name: "init",
  description: "Initialize buttery tokens via a few prompts"
};

export const options: CommandOptions<{ auto: boolean }> = {
  auto: {
    type: "boolean",
    alias: "a",
    description:
      "Skips the prompts and initializes buttery tokens with all of the defaults",
    required: false
  }
};

const systemFont = `system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;

export const action: CommandAction<typeof options> = async ({ options }) => {
  LOG.debug("Initializing buttery-tokens...");

  const defaultWorkingDir = path.resolve(process.cwd());

  const tokenDefaults = {
    gridSystem: 4,
    prefix: "buttery",
    strict: true,
    suppressStrictWarnings: false
  };

  // working directory
  const workingDir = options.auto
    ? defaultWorkingDir
    : await input({
        message: "Where is the root of the project that you're initializing?",
        default: defaultWorkingDir
      });

  // prefix
  LOG.info(
    "In order to ensure that your tokens don't conflict with any other variables from any other third party libraries, it's a best practice to prefix (or namespace) your variables with a prefix. This ensures that they aren't any variables that will overwrite each other which would provide unexpected results."
  );
  const prefix = options.auto
    ? tokenDefaults.prefix
    : await input({
        message: "Please indicate a prefix.",
        default: tokenDefaults.prefix
      });

  // grid system
  LOG.info(
    "In order to preserve harmonious layout, you'll need to pick a grid system scalar. This ensures that all aspects of sizing in your application are in alignment."
  );
  const gridSystem = options.auto
    ? tokenDefaults.gridSystem
    : await select({
        message: "Please select a grid system below",
        choices: [4, 8, 10].map((value) => ({
          value: value.toString(),
          description: value.toString()
        })),
        default: tokenDefaults.gridSystem.toString()
      });

  const strictMode = options.auto
    ? tokenDefaults.strict
    : await confirm({
        message: "Would you like to enable strict mode?",
        default: tokenDefaults.strict
      });

  try {
    // create the buttery.tokens.ts
    const outFile = path.resolve(workingDir, "./tokens.config.ts");
    const outContent = `const tokensConfig = {
  gridSystem: ${gridSystem},
  prefix: "${prefix}",
  strict: ${strictMode},
  suppressStrictWarnings: ${tokenDefaults.suppressStrictWarnings},
  font: {
    family: { 
      heading: '${systemFont}',
      body: '${systemFont}'
    },
    weight: {
      bold: 700,
      "semi-bold": 600,
      medium: 500,
      regular: 400,
      light: 300
    },
    typography: {
      heading1: {
        fontFamily: "heading",
        fontSize: 74,
        lineHeight: 82,
      },
      heading2: {
        fontFamily: "heading",
        fontSize: 64,
        lineHeight: 74,
      }
    }
  }
};
export default tokensConfig;  
`;
    LOG.debug("Creating `tokens.config.ts`...");
    await writeFile(outFile, outContent, { encoding: "utf-8" });
    LOG.debug("Creating `tokens.config.ts`... complete.");

    LOG.success("Buttery tokens successfully initialized!");
  } catch (error) {
    const err = new Error(error as string);
    LOG.fatal(err);
    throw err;
  }
};
