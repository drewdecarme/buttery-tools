import { dev } from "@buttery/docs/dev";
import type {
  CommandAction,
  CommandMeta,
  CommandOptions,
} from "../../../lib/commands/butter-commands.types";

export const meta: CommandMeta = {
  name: "dev",
  description: "Run the development instance",
};

export const options: CommandOptions<{
  "no-prompt": boolean;
}> = {
  "no-prompt": {
    type: "boolean",
    alias: "np",
    description:
      "Disables CLI prompts if any configuration values are not expected / well formed.",
    defaultValue: false,
  },
};

export const action: CommandAction<typeof options> = async () => {
  dev();
};
