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

export type CommandOption = {
  [key: string]: CommandOptionTypeValue | CommandOptionTypeBoolean;
};
export type CommandOptions = CommandOption;

export type CommandAction<O extends CommandOptions | undefined = undefined> =
  (params: { args: string[]; options: O }) => Promise<void>;
