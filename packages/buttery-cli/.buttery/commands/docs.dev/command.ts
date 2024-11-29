import {
  type CommandAction,
  type CommandMeta,
  defineOptions,
} from "@buttery/commands";
import { dev } from "@buttery/docs/cli/dev";

export const meta: CommandMeta = {
  name: "dev",
  description:
    "Run the development serer to iteratively create & live-reload your docs",
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
  open: {
    type: "boolean",
    description:
      "Opens the DevServer to the configured hostname and port upon start",
    alias: "o",
    default: true,
  },
  host: {
    type: "string",
    description: "Specify the port the host should run on",
    alias: "h",
    default: "localhost",
  },
  port: {
    type: "number",
    description: "The port at which the DevServer will run on",
    alias: "p",
    default: 4000,
  },
});

export const action: CommandAction<never, typeof options> = async ({
  options: { debug, ...restOptions },
}) => {
  dev({ logLevel: debug ? "debug" : "warn", ...restOptions });
};
