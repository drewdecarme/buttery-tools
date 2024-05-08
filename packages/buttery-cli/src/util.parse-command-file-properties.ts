import path from "path";
import type {
  CommandAction,
  CommandArgs,
  CommandMeta,
  CommandOptions,
} from "../lib/types";

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
    const commandPath = fileName.split(".js")[0];
    console.warn(
      `"${commandPath}" does not have an "action" export. This command will appear in the help menus but will do nothing when invoked. It is recommended to add an "action" export.`
    );
  }
  const action = props?.action ?? (async () => void 0);

  return {
    action,
    args: props.args ?? [],
    options: props.options ?? {},
    meta: props.meta,
  };
};

export const exhaustiveMatchGuard = (_: never): never => {
  throw new Error("Forgot to include an option in the switch statement");
};
