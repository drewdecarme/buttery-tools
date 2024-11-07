import { exhaustiveMatchGuard } from "@buttery/core/utils/isomorphic";
import { produce } from "immer";
import type { CommandOption } from "../types.js";
import { LOG } from "../utils.js";

/**
 * Provided an array of arguments and some command options,
 * this function will parse and validate the options against
 * the command that was found
 */
export async function parseOptionsFromArgv(
  argv: string[],
  cmdOptions: CommandOption[]
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
      const cmdOption = cmdOptions.find((o) => o.name === optionKey);
      if (!cmdOption) {
        throw `"${optionKey}" is not a valid option`;
      }

      // Process the option value based upon the declared type
      LOG.debug(`Parsing option: ${cmdOption.name}`);
      switch (cmdOption.type) {
        case "boolean":
          return produce(accum, (draft) => {
            let value = cmdOption.default ?? optionValue;
            if (value === "true") value = true;
            if (value === "false") value = false;
            if (typeof value === "undefined") value = true; // option is listed but has no value next to it

            // value hasn't been reconciled from a default or logic yet so it's technically invalid
            if (typeof value !== "boolean") {
              throw `Invalid value "${optionValue}" for boolean option "${cmdOption.name}". Value should either be "true", "false". Adding the option without a value will default to "true".`;
            }

            draft[cmdOption.name] = value;
          });

        case "string":
          return produce(accum, (draft) => {
            const value = optionValue ? String(optionValue) : cmdOption.default;
            draft[cmdOption.name] = value;
          });

        case "number":
          return produce(accum, (draft) => {
            const value = optionValue ? Number(optionValue) : cmdOption.default;
            draft[cmdOption.name] = value;
          });

        default:
          return exhaustiveMatchGuard(cmdOption);
      }
    }, {});

    // Validate that all of the required options are present in the command
    const argOptionKeys = Object.keys(argOptions);
    for (const cmdOption of cmdOptions) {
      if (cmdOption.required && !argOptionKeys.includes(cmdOption.name)) {
        throw `Missing required option "${cmdOption}"`;
      }
    }
    return argOptions;
  } catch (error) {
    throw new Error(String(error));
  }
}
