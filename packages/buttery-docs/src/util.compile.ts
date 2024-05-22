import { createGraph } from "./util.createGraph";
import type { CompileArgs } from "./util.types";

export const compile = async (args: CompileArgs) => {
  const docsGraph = await createGraph(args);
  console.log({ docsGraph });
};
