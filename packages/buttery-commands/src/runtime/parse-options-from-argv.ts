import { exhaustiveMatchGuard } from "@buttery/core/utils/isomorphic";
import { produce } from "immer";
import type { CommandOptions } from "../command-utils.js";
import { LOG } from "../utils.js";

/**
 * Provided an array of arguments and some command options,
 * this function will parse and validate the options against
 * the command that was found
 */
export async function parseOptionsFromArgv(
  argv: string[],
  cmdOptions: CommandOptions
): Promise<Record<string, unknown>> {
  try {
    const argOptions = argv.reduce<Record<string, unknown>>((accum, arg) => {
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
        case "boolean":
          return produce(accum, (draft) => {
            let value = cmdOption.default ?? optionValue;
            if (value === "true") value = true;
            if (value === "false") value = false;
            if (typeof value === "undefined") value = true; // option is listed but has no value next to it

            // value hasn't been reconciled from a default or logic yet so it's technically invalid
            if (typeof value !== "boolean") {
              throw `Invalid value "${optionValue}" for boolean option "${optionKey}". Value should either be "true", "false". Adding the option without a value will default to "true".`;
            }

            draft[optionKey] = value;
          });

        case "string":
          return produce(accum, (draft) => {
            const value = optionValue ? String(optionValue) : cmdOption.default;
            draft[optionKey] = value;
          });

        case "number":
          return produce(accum, (draft) => {
            const value = optionValue ? Number(optionValue) : cmdOption.default;
            draft[optionKey] = value;
          });

        default:
          return exhaustiveMatchGuard(cmdOption);
      }
    }, {});

    // Validate that all of the required options are present in the command
    const argOptionKeys = Object.keys(argOptions);
    for (const [cmdOptionKey, cmdOptionValue] of Object.entries(cmdOptions)) {
      if (cmdOptionValue.required && !argOptionKeys.includes(cmdOptionKey)) {
        throw `Missing required option "${cmdOptionKey}"`;
      }
    }
    return argOptions;
  } catch (error) {
    throw new Error(String(error));
  }
}
