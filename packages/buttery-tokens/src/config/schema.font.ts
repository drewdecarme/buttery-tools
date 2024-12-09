import { z } from "zod";

const fallbackDefault =
  'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

export const butteryTokensConfigFontSchema = z
  .object({
    /**
     * The base font-size
     * @default 16
     */
    baseSize: z.preprocess(
      (value) => value ?? 16,
      z.number().optional().default(16)
    ),
    /**
     * A record of key/value strings that will be variables that can be used as the font families.
     * You can have as many as you want but a good guidance would be
     * 1. `heading`
     * 2. `body`
     */
    families: z.preprocess(
      (value) =>
        value ?? {
          heading: "system-ui",
          body: "system-ui",
        },
      z.record(z.string(), z.string()).optional()
    ),
    /**
     * A fallback for font families that don't render
     */
    fallback: z.preprocess(
      (value) => value ?? fallbackDefault,
      z.string().optional()
    ),
    /**
     * A record of key/value strings that will be variables that can be used as the font weights.
     * You can have as many as you want but a good guidance would be
     * 1. `light`
     * 2. `regular`
     * 2. `semi-bold`
     * 2. `bold`
     * 2. `black`
     */
    weights: z.preprocess(
      (value) =>
        value ?? {
          regular: 400,
        },
      z.record(z.string(), z.number()).optional().default({
        regular: 400,
      })
    ),
    variants: z.preprocess(
      (value) => value ?? {},
      z
        .record(
          z.string(),
          z.object({
            family: z.string(),
            weight: z.string(),
            size: z.number(),
            lineHeight: z.number(),
          })
        )
        .optional()
    ),
  })
  .superRefine((data, ctx) => {
    // Ensure font.variants[variantName].family keys match font.families
    const familyKeys = Object.keys(data.families ?? {});
    const variantEntries = Object.entries(data.variants ?? {});

    if (variantEntries.length === 0) return;

    for (const [key, variant] of variantEntries) {
      if (!familyKeys.includes(variant.family)) {
        ctx.addIssue({
          code: "invalid_union",
          path: ["variants", key, "family"],
          unionErrors: [],
          message: `family must be one of: ${familyKeys.join(", ")}`,
        });
      }
    }

    // Ensure font.variants[variantName].weight keys match font.weights
    const weightKeys = Object.keys(data.weights ?? {});
    for (const [key, variant] of variantEntries) {
      if (!weightKeys.includes(variant.weight)) {
        ctx.addIssue({
          code: "invalid_union",
          path: ["variants", key, "weight"],
          unionErrors: [],
          message: `weight must be one of: ${weightKeys.join(", ")}`,
        });
      }
    }
  });

export type ButteryTokensConfigFont = z.infer<
  typeof butteryTokensConfigFontSchema
>;
export type ButteryTokensConfigFontWellFormed =
  Required<ButteryTokensConfigFont>;
