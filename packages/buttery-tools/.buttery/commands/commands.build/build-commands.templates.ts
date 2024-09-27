/**
 * The program index template. This is the entry file
 * to the CLI program itself.
 */
export const templateIndex = `#! /usr/bin/env node
import { program } from "commander";
import path from "path";
import { existsSync } from 'node:fs';

function getCommandPath(segmentCommand) {
  const possiblePaths = [
    path.resolve(import.meta.dirname, \`./\${segmentCommand}.js\`),
    path.resolve(import.meta.dirname, \`./\${segmentCommand}/command.js\`)
  ]

  const foundPath = possiblePaths.reduce((accum, possiblePath) => {
    if (existsSync(possiblePath)) {
      return possiblePath;
    }
    return accum;
  }, undefined);

  if (!foundPath) {
    throw "Cannot find path of \`\${segmentCommand}\`."
  }

  const timestamp = new Date().getTime();
  return foundPath.concat(\`?t=\${timestamp}\`);
}

function withParsedAction(segmentCommand) {
  return async function(...restArgs) {

    try {
      const commandPath = getCommandPath(segmentCommand)
      const command = await import(commandPath);
      restArgs.pop();
      const options = restArgs[restArgs.length - 1];
      restArgs.pop();
      const args = (command.args ?? []).map((arg, i) => {
        return [arg.name, restArgs[i] as string];
      });
      const action = command.action ?? ((params) => console.log("No action defined", params));
      return action({ args, options });
    } catch (error) {
      throw error;
    }
  }
}

try {
  program.name("{{{ cli_name }}}").description("{{{ cli_description }}}");
  {{{ cli_commands }}}
  await program.parseAsync();
} catch(error) {
  console.error(error);
  throw new Error(error);
}
`;

/**
 * This is the command parent template where if parent command
 * doesn't exist, this template is used as a creation point.
 */
export const templateCommandParent = `import { CommandMeta } from "@buttery/tools/commands";

export const meta: CommandMeta = {
  name: "{{{command_name}}}",
  description: "{{{command_name}}} description... Please update me",
};
`;
