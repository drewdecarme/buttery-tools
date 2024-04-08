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
  required?: boolean;
  defaultValue?: string;
};
export type CommandArgs = CommandArg[];
export type CommandOption = {
  /**
   * The flag that will enable this option. This flag
   * should be a kebab-cased option and not contain any other
   * special characters other than the flag itself.
   * @example test-option
   * @return --test-option
   */
  flag: string;
  alias: string;
  description: string;
  defaultValue?: string;
};
export type CommandOptions = CommandOption[];

export type CommandAction<
  A extends CommandArgs | undefined = undefined,
  O extends CommandOptions | undefined = undefined
> = (params: { args: A; options: O }) => Promise<void>;
