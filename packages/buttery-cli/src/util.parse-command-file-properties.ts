import {
  CommandAction,
  CommandArgs,
  CommandMeta,
  CommandOptions,
} from "./types";

type CommandProperties = {
  meta: CommandMeta;
  args: CommandArgs;
  options: CommandOptions;
  action: CommandAction;
};

export const parseCommandFileProperties = ({
  content,
  fileName,
}: {
  content: any;
  fileName: string;
}): CommandProperties => {
  const props = content as Partial<{
    meta: CommandMeta;
    args: CommandArgs;
    options: CommandOptions;
    action: CommandAction;
  }>;
  // Validate command.meta and set the description
  if (!props.meta) {
    throw `Error in '${fileName}'. 'meta' export not detected. Please ensure that you have exported a 'meta' configuration object from the '${fileName}'.`;
  }

  // Validate the action and set the action
  if (!props.action) {
    throw new Error(
      `Error in '${fileName}'. 'action' export not detected. Please ensure that you have exported a 'action' configuration object from the '${fileName}'.`
    );
  }
  return {
    action: props.action,
    args: props.args ?? [],
    options: props.options ?? {},
    meta: props.meta,
  };
};

export const exhaustiveMatchGuard = (_: never): never => {
  throw new Error("Forgot to include an option in the switch statement");
};
