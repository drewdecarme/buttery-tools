import { exhaustiveMatchGuard } from "@buttery/core/utils/isomorphic";
import pc from "picocolors";
import {
  type ButteryCommandManifestEntry,
  type ButteryCommandsManifest,
  LOG,
} from "../utils/utils";

const formatTitle = (title: string) => pc.bold(pc.underline(title));

export async function buildManifestHelpMenus(
  manifest: ButteryCommandsManifest
): Promise<void> {
  let rootCmd = "";

  function buildHelpMenu(cmd: ButteryCommandManifestEntry) {
    if (cmd.level === 0) {
      rootCmd = cmd.name;
    }
    LOG.debug(`Building help for "${cmd.name}"`);
    const lines: string[] = [];
    lines.push("");

    const command = `${rootCmd} ${cmd.commandSegments.join(" ")}`;
    const subCommands = Object.values(cmd.subCommands);
    const args = Object.entries(cmd.args ?? {});
    const argStrings = args.reduce<{ required: ""; optional: "" }>( // TODO: Add string formatter
      (accum, [argName, argValue]) => {
        if (argValue.required) {
          return Object.assign(accum, {
            required: accum.required.concat(` <${argName}>`),
          });
        }
        return Object.assign(accum, {
          optional: " [args]",
        });
      },
      { required: "", optional: "" }
    );
    const opts = Object.entries(cmd.options ?? {});

    // KEY
    // <> = required
    // [] = optional
    //
    // by default, all required args and options will be displayed via their properties
    // all other optional args wil be displayed with args or --options

    // Usage
    lines.push(formatTitle("Usage:"));
    const subCommandStr = subCommands.length > 0 ? " <subcommand>" : ""; // if sub commands exist they're always marked as required
    const argStr =
      args.length === 0 ? "" : `${argStrings.required}${argStrings.optional}`;
    const optStr = opts.length === 0 ? "" : " [--options]";

    lines.push(`  ${command}${subCommandStr}${argStr}${optStr}`);
    lines.push("");

    // Description
    lines.push(formatTitle("Description:"));
    lines.push(`  ${cmd.description}`);
    lines.push("");

    // Positional Args
    if (args.length > 0) {
      lines.push(formatTitle("Arguments:"));
      let longestKey = 0;
      const argMenu = args.reduce<{ key: string; description: string }[]>(
        (accum, [argName, argProps]) => {
          // create the argDescription
          const type = argProps.required
            ? `<${argProps.type}>`
            : `[${argProps.type}]`;
          const descriptionBase = `${argProps.description} ${type}`;

          const requirement = argProps.required ? "required" : "optional";
          const defaulted = argProps.default
            ? `default: ${argProps.default}`
            : undefined;
          let choices = "";
          let validations = "";

          switch (argProps.type) {
            case "string": {
              if (argProps.choices) {
                choices = `choices: [${argProps.choices.join(", ")}]`;
              }
              if (argProps.length) {
                const length = Object.entries(argProps.length).reduce<string[]>(
                  (accum, [valName, valValue]) => {
                    return accum.concat(`${valName}: ${valValue}`);
                  },
                  []
                );
                validations = validations.concat(
                  `length: [${length.join(", ")}]`
                );
              }
              break;
            }

            case "number": {
              if (argProps.choices) {
                choices = `choices: [${argProps.choices.join(", ")}]`;
              }
              if (argProps.range) {
                const range = Object.entries(argProps.range).reduce<string[]>(
                  (accum, [valName, valValue]) => {
                    return accum.concat(`${valName}: ${valValue}`);
                  },
                  []
                );
                validations = validations.concat(
                  `range: [${range.join(", ")}]`
                );
              }

              break;
            }

            case "boolean":
              break;

            default:
              exhaustiveMatchGuard(argProps);
          }

          // Set the longest name to correctly indent the name
          if (argName.length > longestKey) {
            longestKey = argName.length;
          }

          const descriptionProps = [
            requirement,
            choices,
            validations,
            defaulted,
          ]
            .filter(Boolean)
            .join(", ");
          const description = `${descriptionBase} ${pc.dim(
            `(${descriptionProps})`
          )}`;

          return accum.concat({
            key: argName,
            description,
          });
        },
        []
      );
      for (const { key, description } of argMenu) {
        lines.push(`  ${key.padEnd(longestKey)}  ${description}`);
      }
      lines.push("");
    }

    // Options
    if (opts.length > 0) {
      lines.push(formatTitle("Options:"));
      let longestName = 0;
      const optionMenu = opts.reduce<{ key: string; description: string }[]>(
        (accum, [optName, optValue]) => {
          // create the option key
          const name = `--${optName}`;
          const alias = optValue.alias ? `, -${optValue.alias}` : " ";
          const type = optValue.required
            ? `<${optValue.type}>`
            : `[${optValue.type}]`;
          const optKey = `${name}${alias}`;

          // determine the padding needed to evenly indent
          // the keys based upon their length
          if (optKey.length > longestName) {
            longestName = optKey.length;
          }

          // create the optDescription
          const defaultVal = optValue.default
            ? `(default: ${optValue.default})`
            : null;
          const requirement = optValue.required ? "required" : "optional";
          const descriptionProps = pc.dim(
            `(${[requirement, defaultVal].filter(Boolean).join(", ")})`
          );
          const optDescription = `${optValue.description} ${type} ${descriptionProps}`;

          return accum.concat({ key: optKey, description: optDescription });
        },
        []
      );

      for (const { key, description } of optionMenu) {
        lines.push(`  ${key.padEnd(longestName)}  ${description}`);
      }
      lines.push("");
    }

    const helpMenu = lines.join("\n");

    cmd.help = helpMenu;

    // recurse on the sub-commands
    for (const subCommand of subCommands) {
      buildHelpMenu(subCommand);
    }
  }

  for (const cmd of Object.values(manifest)) {
    buildHelpMenu(cmd);
  }
}
