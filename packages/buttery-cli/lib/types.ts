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
  defaultValue?: string;
};

type CommandOptionTypeBoolean = CommandOptionShared & {
  type: "boolean";
  defaultValue?: boolean;
};

type CommandOptionTypeNumber = CommandOptionShared & {
  type: "number";
  defaultValue?: number;
};

export type CommandOptionType =
  | CommandOptionTypeValue
  | CommandOptionTypeBoolean
  | CommandOptionTypeNumber;

export type CommandOptions<
  T extends Record<string, boolean | number | string>,
> = {
  [K in keyof T]: T[K] extends boolean
    ? CommandOptionTypeBoolean
    : T[K] extends number
      ? CommandOptionTypeNumber
      : T[K] extends string
        ? CommandOptionTypeValue
        : never;
};

type InferOptionType<T> = T extends { type: "boolean" }
  ? boolean
  : T extends { type: "number" }
    ? number
    : T extends { type: "value" }
      ? string
      : never;

export type CommandAction<T> = (params: {
  args: unknown;
  options: {
    [K in keyof T]: InferOptionType<T[K]>;
  };
}) => Promise<void>;
