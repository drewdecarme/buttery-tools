import type { CommandAction, CommandMeta } from "../../src/types";
import { LOG } from "../../src/utils";

export const meta: CommandMeta = {
  name: "nested",
  description:
    "A command that tests out the nested flat-file sub-command convention",
};

export const action: CommandAction = async () => {
  LOG.debug("Hello from the `file.nested` command!");
};
