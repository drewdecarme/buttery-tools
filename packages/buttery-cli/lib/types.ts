/**
 * @deprecated Please use the ButteryConfig type
 */
export type CLIConfig = {
  name: string;
  description: string;
  version?: string;
  root: string;
};
export type ButteryConfig = {
  name: string;
  description: string;
  version?: string;
  root: string;
  tokens: Record<string, unknown>;
};

export type CommandMeta = {
  name: string;
  description: string;
};
export type CommandArg = {
  name: string;
  description: string;
  required: boolean;
  defaultValue?: string;
};
export type CommandArgs = CommandArg[];
type CommandOptionShared = {
  /**
   * The flag that will enable this option. This flag
   * should be a kebab-cased option and not contain any other
   * special characters other than the flag itself.
   * @example test-option
   * @return --test-option
   */
  alias: string;
  description: string;
  required?: boolean;
};
type CommandOptionTypeValue = CommandOptionShared & {
  type: "value";
};
type CommandOptionTypeBoolean = CommandOptionShared & {
  type: "boolean";
};
type CommandOptionType = CommandOptionTypeValue | CommandOptionTypeBoolean;

export type CommandOptions<T extends string> = {
  [key in T]: CommandOptionType;
};

// @ts-ignore
export type CommandAction<O extends CommandOptions = CommandOptions> =
  (params: {
    args: unknown;
    options: { [key in keyof O]: string };
  }) => Promise<void>;
