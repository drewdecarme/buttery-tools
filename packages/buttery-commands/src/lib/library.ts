export type CommandMeta = {
  name: string;
  description: string;
};
/**
 * A helper function that let's you easily define the
 * meta parameters of your Buttery Command file.
 *
 * **Note**: At this point,
 * it's not necessary to use this since we're not going to
 * use this constant to infer any types anywhere, but if you're
 * into consistency, this can be used in place of staticly typing
 * your `meta` export with `CommandMeta`
 */
export const defineMeta = (meta: CommandMeta) => meta;

type CommandOptionShared = {
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
  // TODO: Add validate back in
  // validate?: (value: string) => boolean;
};
type CommandOptionNumber = CommandOptionShared & {
  type: "number";
  default?: number;
  // TODO: Add validate back in
  // validate?: (value: number) => boolean;
};
export type CommandOption =
  | CommandOptionBoolean
  | CommandOptionString
  | CommandOptionNumber;
export type CommandOptions = { [key: string]: CommandOption };

type InferOptionValues<T extends CommandOptions> = {
  [K in keyof T]: T[K] extends CommandOptionBoolean
    ? boolean
    : T[K] extends CommandOptionNumber
    ? number
    : T[K] extends CommandOptionString
    ? string
    : never;
};

/**
 * A helper function that let's you easily define options that should be
 * supplied to the action function in your Buttery Command. You should use
 * this function to create your options so TypeScript can easily infer
 * the types of the option values supplied to the actions parameter.
 *
 * **Note** It's okay if you don't use this to type your options, but your
 * action won't be able to correctly infer the keys of your options and it may
 * make it a little harder to work with in your action.
 */
export const defineOptions = <T extends CommandOptions>(options: T) => options;

export type CommandAction<O extends CommandOptions = CommandOptions> =
  (params: { options: InferOptionValues<O> }) => Promise<void> | void;
