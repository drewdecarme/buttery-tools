import { z } from "zod";

import { FontSchema } from "./schema.font.js";
import { ColorSchema } from "./schema.color.js";
import { BreakpointsSchema } from "./schema.breakpoints.js";
import { GridSystemSchema } from "./schema.grid.js";
import { RuntimeSchema } from "./schema.runtime.js";
import { CustomSchema } from "./schema.custom.js";

export const ConfigSchema = z.object({
  runtime: RuntimeSchema,
  gridSystem: GridSystemSchema,
  font: FontSchema,
  breakpoints: BreakpointsSchema,
  color: ColorSchema,
  custom: CustomSchema,
});
export type ButteryTokensConfig = z.infer<typeof ConfigSchema>;
