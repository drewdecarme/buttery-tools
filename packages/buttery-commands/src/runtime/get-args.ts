import type { WellFormedCommandArgs } from "./runtime.types.js";

import type { CommandArgs } from "../lib/index.js";

/**
 * Provided the args of the current command, we loop through
 * an array of positional args and validate them against the
 * declared args in the current command.
 */
export async function getArgs(argv: string[], cmdArgs: CommandArgs) {
  const argKeys = Object.keys(cmdArgs);

  const parsedArgs = argv.reduce<WellFormedCommandArgs>(
    (result, argValue, index) => {
      const argName = argKeys[index];
      const cmdArg = cmdArgs[argName];

      if (!cmdArg) {
        throw new Error(`Unexpected positional argument: "${argValue}"`);
      }

      switch (cmdArg.type) {
        case "boolean": {
          // Handle boolean arguments
          const value = argValue?.toLowerCase() === "true" || argValue === "1";
          result[argName] = value ?? cmdArg.default ?? false;
          break;
        }

        case "string": {
          // Handle string arguments
          if (typeof argValue !== "string") {
            throw new Error(`Expected a string for argument "${argName}"`);
          }

          // Check for length constraints
          if (cmdArg.length) {
            const { min, max } = cmdArg.length;
            if (min !== undefined && argValue.length < min) {
              throw new Error(
                `Argument "${argName}" must have at least ${min} characters`
              );
            }
            if (max !== undefined && argValue.length > max) {
              throw new Error(
                `Argument "${argName}" must have at most ${max} characters`
              );
            }
          }

          // Check for choices
          if (cmdArg.choices && !cmdArg.choices.includes(argValue)) {
            throw new Error(
              `Argument "${argName}" must be one of: ${cmdArg.choices.join(
                ", "
              )}`
            );
          }

          // Custom validation
          if (cmdArg.validate && !cmdArg.validate(argValue)) {
            throw new Error(`Validation failed for argument "${argName}"`);
          }

          result[argName] = argValue ?? cmdArg.default;
          break;
        }

        case "number": {
          // Handle number arguments
          const parsedValue = Number(argValue);
          if (Number.isNaN(parsedValue)) {
            throw new Error(`Expected a number for argument "${argName}"`);
          }

          // Check for range constraints
          if (cmdArg.range) {
            const { min, max } = cmdArg.range;
            if (min !== undefined && parsedValue < min) {
              throw new Error(`Argument "${argName}" must be at least ${min}`);
            }
            if (max !== undefined && parsedValue > max) {
              throw new Error(`Argument "${argName}" must be at most ${max}`);
            }
          }

          // Check for choices
          if (cmdArg.choices && !cmdArg.choices.includes(parsedValue)) {
            throw new Error(
              `Argument "${argName}" must be one of: ${cmdArg.choices.join(
                ", "
              )}`
            );
          }

          // Custom validation
          if (cmdArg.validate && !cmdArg.validate(parsedValue)) {
            throw new Error(`Validation failed for argument "${argName}"`);
          }

          result[argName] = parsedValue ?? cmdArg.default;
          break;
        }

        default:
          throw new Error(`Unsupported argument type for "${argName}"`);
      }

      return result;
    },
    {}
  );

  // Validate that all of the required options are present in the command
  const parsedOptionKeys = Object.keys(parsedArgs);
  for (const [cmdArgKey, cmdArgValue] of Object.entries(cmdArgs)) {
    if (cmdArgValue.required && !parsedOptionKeys.includes(cmdArgKey)) {
      throw `Missing required positional arg "${cmdArgKey}".`;
    }
  }

  return parsedArgs;
}
