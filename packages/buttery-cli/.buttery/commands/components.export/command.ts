import type { CommandMeta, CommandAction } from "@buttery/commands";
import { defineArgs, defineOptions } from "@buttery/commands";
import { exportComponent } from "@buttery/components/cli/export";

export const meta: CommandMeta = {
  name: "export",
  description: "Export any buttery-components via wizard or by args",
};

export const options = defineOptions({
  "log-level": {
    type: "string",
    description: "The level at which the logs should display",
    default: "info",
    alias: "l",
    required: false,
  },
});

export const args = defineArgs({
  outdir: {
    type: "string",
    name: "outdir",
    description:
      "The directory the selected component should be exported to relative to the current working directory",
    required: true,
  },
});

export const action: CommandAction<typeof args, typeof options> = async ({
  options,
  args,
}) => {
  exportComponent({
    outDir: args.outdir,
    logLevel: options["log-level"],
  });
};
