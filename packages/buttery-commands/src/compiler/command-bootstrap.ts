import {
  exhaustiveMatchGuard,
  inlineTryCatch,
} from "@buttery/core/utils/isomorphic";
import { input, select } from "@inquirer/prompts";
import { ensureFile } from "fs-extra";

import { writeFile } from "node:fs/promises";

export async function bootstrapCommand(
  cmdPath: string,
  options?: { defaultName?: string }
) {
  const bootstrapType = await select<"basic" | "custom">({
    message: "How would you like to bootstrap the file?",
    choices: [
      {
        name: "Basic command with name and description",
        value: "basic",
      },
      {
        name: "Custom command with options, args, and/or action",
        value: "custom",
      },
    ],
  });
  const newCmdName = await input({
    message: "Please provide a name for the command",
    default: options?.defaultName,
  });
  const newCmdDescription = await input({
    message: `Please add a description for this the "${newCmdName}" command`,
  });

  const meta = `import type { CommandMeta } from "@buttery/commands";

export const meta: CommandMeta = {
  name: "${newCmdName}",
  description: "${newCmdDescription}",
};
`;

  // ensure that the file exists
  try {
    await ensureFile(cmdPath);
  } catch (error) {
    throw new Error(`Unable to verify the ${cmdPath}`);
  }

  let fileContent = "";

  switch (bootstrapType) {
    case "basic": {
      fileContent = meta;
      break;
    }

    case "custom": {
      // TODO: Ensure that all of the properties are queried for
      break;
    }

    default:
      exhaustiveMatchGuard(bootstrapType);
  }

  const writeFileResult = await inlineTryCatch(writeFile)(
    cmdPath,
    fileContent,
    { encoding: "utf8" }
  );
  if (writeFileResult.hasError) {
    throw writeFileResult.error;
  }

  return cmdPath;
}
