import path from "node:path";
import type { CommandAction, CommandMeta, CommandOptions } from "../lib/types";

export const meta: CommandMeta = {
  name: "nested-1",
  description: "Cras mattis consectetur purus sit amet fermentum."
};

export const options: CommandOptions<"first"> = {
  first: {
    type: "value",
    alias: "f",
    description: "display just the first substring",
    required: false
  }
};

export const action: CommandAction = async (params) => {
  console.log(
    "Hello from the `random.saved.nested-1` command.",
    params,
    path.resolve(import.meta.dirname, "../images")
  );
};
