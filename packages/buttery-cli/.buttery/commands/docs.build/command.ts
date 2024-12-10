import {
  type CommandAction,
  type CommandMeta,
  defineOptions,
} from "@buttery/commands";
import { build } from "@buttery/docs/cli/build";
import { tryHandle } from "@buttery/utils/isomorphic";

import { LOG_CLI } from "../_utils";

export const meta: CommandMeta = {
  name: "build",
  description:
    "Build's necessary production assets for the `@buttery/docs` application deployment",
};

export const options = defineOptions({
  prompt: {
    type: "boolean",
    description:
      "If the required folder structures don't exist, display prompts to create them / re-align them instead of throwing errors",
    alias: "p",
    default: true,
  },
  debug: {
    type: "boolean",
    description: "Prints out the logs",
    alias: "d",
    default: false,
  },
});

export const action: CommandAction<never, typeof options> = async ({
  options: { debug, ...options },
}) => {
  const res = await tryHandle(build)({
    ...options,
    logLevel: debug ? "debug" : "warn",
  });
  if (res.error) {
    LOG_CLI.fatal(res.error);
  }
};
