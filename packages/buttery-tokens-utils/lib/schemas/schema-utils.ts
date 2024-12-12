import type { ZodTypeAny } from "zod";
import { z } from "zod";

export function optionalSchema<T extends ZodTypeAny>(
  schema: T,
  defaultValue: z.infer<T>
) {
  return z.preprocess(
    (value) => (value === undefined ? defaultValue : value),
    schema.optional()
  );
}
