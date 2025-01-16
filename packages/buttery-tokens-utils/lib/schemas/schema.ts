import { z } from "zod";

import { FontSchema } from "./schema.font.js";
import { ColorSchema } from "./schema.color.js";
import { ResponseSchema } from "./schema.response.js";
import { SizeAndSpaceSchema } from "./schema.size-and-space.js";
import { RuntimeSchema } from "./schema.runtime.js";
import { CustomSchema } from "./schema.custom.js";

export const ConfigSchema = z.object({
  runtime: RuntimeSchema,
  sizeAndSpace: SizeAndSpaceSchema,
  font: FontSchema,
  response: ResponseSchema,
  color: ColorSchema,
  custom: CustomSchema,
});
export type ButteryTokensConfig = z.infer<typeof ConfigSchema>;
