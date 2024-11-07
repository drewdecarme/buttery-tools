// export type CommandMeta = {
//   name: string;
//   description: string;
// };
// export type CommandArg = {
//   name: string;
//   description: string;
//   required: boolean;
//   defaultValue?: string;
// };
// export type CommandArgs = CommandArg[];
// type CommandOptionShared = {
//   /**
//    * The flag that will enable this option. This flag
//    * should be a kebab-cased option and not contain any other
//    * special characters other than the flag itself.
//    * @example test-option
//    * @return --test-option
//    */
//   alias: string;
//   description: string;
//   required?: boolean;
// };

// type CommandOptionTypeValue = CommandOptionShared & {
//   type: "value";
//   defaultValue?: string;
// };

// type CommandOptionTypeBoolean = CommandOptionShared & {
//   type: "boolean";
//   defaultValue?: boolean;
// };

// type CommandOptionTypeNumber = CommandOptionShared & {
//   type: "number";
//   defaultValue?: number;
// };

// export type CommandOptionType =
//   | CommandOptionTypeValue
//   | CommandOptionTypeBoolean
//   | CommandOptionTypeNumber;

// type InferOptionType<T extends boolean | number | string> = T extends boolean
//   ? CommandOptionTypeBoolean
//   : T extends number
//   ? CommandOptionTypeNumber
//   : T extends string
//   ? CommandOptionTypeValue
//   : never;

// export type CommandOptions<
//   T extends Record<string, boolean | number | string> = Record<string, string>
// > = {
//   [K in keyof T]: InferOptionType<T[K]>;
// };

// type InferOptionValue<T> = T extends { type: "boolean" }
//   ? boolean
//   : T extends { type: "number" }
//   ? number
//   : T extends { type: "value" }
//   ? string
//   : never;

import type { CommandFile } from "./utils.js";

type CommandOptionShared = {
  name: string;
  description: string;
  alias?: string;
  required?: boolean;
};
type CommandOptionBoolean = CommandOptionShared & {
  type: "boolean";
  default?: boolean;
};
type CommandOptionString = CommandOptionShared & {
  type: "string";
  default?: string;
};
type CommandOptionNumber = CommandOptionShared & {
  type: "number";
  default?: number;
};

export type CommandOption =
  | CommandOptionBoolean
  | CommandOptionString
  | CommandOptionNumber;
// | CommandOptionParser;
export type CommandOptions = readonly CommandOption[];

// Generate a mapped type from CommandOptions
// export type OptionsMap<T extends CommandOptions> = {
//   [K in T[number]["name"]]: Extract<
//     T[number],
//     { name: K }
//   >["type"] extends "boolean"
//     ? boolean
//     : Extract<T[number], { name: K }>["type"] extends "number"
//     ? number
//     : string;
// };

// LiteralOptions: Helper type to enforce the final literal type
type LiteralOptions<T extends CommandOptions> = T extends CommandOptions
  ? T
  : never;

// Define a type-asserted helper to wrap `options` as const
// export function defineOptions<T extends readonly CommandOption[]>(
//   options: T
// ): T {
//   return options;
// }

export function defineCommand<T extends CommandOptions>(config: {
  options: LiteralOptions<T>;
  action: (options: OptionsMap<T>) => Promise<void> | void;
}) {
  return config;
}

export type CommandMeta = {
  name: string;
  description: string;
};

type CommandArg = string;

export type ButteryCommand = {
  meta: CommandMeta;
  options: CommandOption[];
  args: CommandArg[];
  action?: () => void;
};

export type ButteryCommandManifestEntry = ButteryCommand & {
  subCommands: ButteryCommandsManifest;
};

export type ButteryCommandsManifest = {
  [key: string]: ButteryCommandManifestEntry;
};

export type EnrichedButteryCommand = CommandFile & { module: ButteryCommand };

type PreserveLiterals<T> = T extends Array<infer U>
  ? Array<PreserveLiterals<U>>
  : { [K in keyof T]: T[K] extends object ? PreserveLiterals<T[K]> : T[K] };

export function defineOptions<T extends CommandOption[]>(
  options: PreserveLiterals<T>
): T {
  return options as T;
}
// Define the options map type to ensure correct inference in action
export type OptionsMap<T extends CommandOptions> = {
  [K in T[number] as K["name"]]: K["type"] extends "boolean"
    ? boolean
    : K["type"] extends "number"
    ? number
    : string;
};

export const defineMeta = (meta: CommandMeta) => meta;

// Define the type for action function, inferring options parameter
export type CommandAction<T extends LiteralOptions<CommandOptions>> = (params: {
  options: OptionsMap<T>;
}) => Promise<void>;

export function defineAction<O extends LiteralOptions<CommandOptions>>(
  fn: (params: { options: OptionsMap<O> }) => Promise<void> | void
) {
  return fn;
}

export type CommandOptionObj = Record<string, CommandOption>;
type CommandOptionsMap<T extends CommandOptionObj> = {
  [K in keyof T]: T[K]["type"] extends "boolean"
    ? boolean
    : T[K]["type"] extends "number"
    ? number
    : string;
};
type LiteralOptionsObj<T extends CommandOptionObj> = T extends CommandOptions
  ? T
  : never;
export type CommandActionTT<T extends CommandOptionObj> = (
  options: CommandOptionsMap<T>
) => Promise<void>;
