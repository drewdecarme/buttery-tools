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
export type CommandArgs = {
  [key: string]: {
    description: string;
  };
};
export type CommandOptions = {
  [key: string]: {
    alias: string;
    description: string;
  };
};

export type CommandAction<
  A extends CommandArgs | undefined = undefined,
  O extends CommandOptions | undefined = undefined
> = (params: { args: A; options: O }) => Promise<void>;
