export type CLIConfig = {
  name: string;
  description: string;
  version?: string;
  root: string;
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

export type CommandOption = {
  [key: string]: CommandOptionType;
};
export type CommandOptions = CommandOption;

export type CommandAction<
  A extends CommandArgs = [],
  O extends CommandOptions = CommandOptions
> = (params: {
  args: { [key in A[0]["name"]]: string };
  options: { [key in keyof O]: string };
}) => Promise<void>;
