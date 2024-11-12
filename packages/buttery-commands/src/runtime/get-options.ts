import { exhaustiveMatchGuard } from "@buttery/core/utils/isomorphic";
import type { CommandOptions } from "../lib/library.js";
import type { WellFormedCommandOptions } from "../utils/runtime.types.js";
import { LOG } from "../utils/utils.js";

/**
 * Provided an array of arguments and some command options,
 * this function will parse and validate the options against
 * the command that was found
 */
export async function getOptions(argv: string[], cmdOptions: CommandOptions) {
  const parsedOptions = argv.reduce<WellFormedCommandOptions>((accum, arg) => {
    // only process args that begin with a dash
    if (!arg.startsWith("-")) return accum;

    let optionKey = "";
    let optionValue: string | undefined;

    // full length
    if (arg.startsWith("--")) {
      const [rawOptionKey, rawOptionValue] = arg.split("=");
      optionKey = rawOptionKey.split("--")[1];
      optionValue = rawOptionValue;
    }
    // alias option
    else if (arg.startsWith("-")) {
      const [rawOptionKey, rawOptionValue] = arg.split("=");
      optionKey = rawOptionKey.split("-")[1];
      optionValue = rawOptionValue;
    }

    // Find the matching option from the command to process the option value
    const cmdOption = cmdOptions[optionKey];
    if (!cmdOption) {
      throw `"${optionKey}" is not a valid option`;
    }

    // Process the option value based upon the declared type
    LOG.debug(`Parsing option: ${optionKey}`);
    switch (cmdOption.type) {
      case "boolean": {
        let value = cmdOption.default ?? optionValue;
        if (value === "true") value = true;
        if (value === "false") value = false;
        if (typeof value === "undefined") value = true; // option is listed but has no value next to it

        // value hasn't been reconciled from a default or logic yet so it's technically invalid
        if (typeof value !== "boolean") {
          throw `Invalid value "${optionValue}" for boolean option "${optionKey}". Value should either be "true", "false". Adding the option without a value will default to "true".`;
        }

        accum[optionKey] = value;
        break;
      }

      case "string": {
        const value = optionValue ? String(optionValue) : cmdOption.default;

        // Check for a type of string
        if (typeof value !== "string") {
          throw `Option "${optionKey}" must have a string value`;
        }

        accum[optionKey] = value;
        break;
      }

      case "number": {
        const value = optionValue ? Number(optionValue) : cmdOption.default;

        // check for a number
        if (Number.isNaN(value)) {
          throw `Option "${optionKey}" must be a parsable number.`;
        }

        // Check for a value
        if (typeof value === "undefined") {
          throw `Expected "${optionKey}" to have a value.`;
        }

        accum[optionKey] = value;
        break;
      }

      default:
        exhaustiveMatchGuard(cmdOption);
        break;
    }

    return accum;
  }, {});

  // Validate that all of the required options are present in the command
  const parsedOptionKeys = Object.keys(parsedOptions);
  for (const [cmdOptionKey, cmdOptionValue] of Object.entries(cmdOptions)) {
    if (cmdOptionValue.required && !parsedOptionKeys.includes(cmdOptionKey)) {
      throw `Missing required option "${cmdOptionKey}"`;
    }
  }

  return parsedOptions;
}
