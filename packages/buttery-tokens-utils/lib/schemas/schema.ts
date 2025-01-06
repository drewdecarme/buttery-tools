import { z } from "zod";

import { FontSchema } from "./schema.font.js";
import { ColorSchema } from "./schema.color.js";
import { BreakpointsSchema } from "./schema.breakpoints.js";
import { SizeAndSpaceSchema } from "./schema.size-and-space.js";
import { RuntimeSchema } from "./schema.runtime.js";
import { CustomSchema } from "./schema.custom.js";

export const ConfigSchema = z.object({
  runtime: RuntimeSchema,
  size: SizeAndSpaceSchema,
  font: FontSchema,
  breakpoints: BreakpointsSchema,
  color: ColorSchema,
  custom: CustomSchema,
});
export type ButteryTokensConfig = z.infer<typeof ConfigSchema>;
