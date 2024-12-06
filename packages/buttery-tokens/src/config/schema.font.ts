import { z } from "zod";

export const butteryTokensConfigFontSchema = z
  .object({
    /**
     * The base font-size
     * @default 16
     */
    baseSize: z.preprocess(
      (value) => (typeof value === "undefined" ? 16 : value),
      z.number().optional()
    ),
    /**
     * A record of key/value strings that will be variables that can be used as the font families.
     * You can have as many as you want but a good guidance would be
     * 1. `font-family-heading`
     * 2. `font-family-body`
     */
    families: z.record(z.string(), z.string()),
    /**
     * A record of key/value strings that will be variables that can be used as the font weights.
     * You can have as many as you want but a good guidance would be
     * 1. `light`
     * 2. `regular`
     * 2. `semi-bold`
     * 2. `bold`
     * 2. `black`
     */
    weights: z.record(z.string(), z.string()),
    variants: z.record(
      z.string(),
      z.object({
        family: z.string(),
        weight: z.string(),
        size: z.number(),
        lineHeight: z.number(),
      })
    ),
  })
  .superRefine((data, ctx) => {
    // Ensure font.variants[variantName].family keys match font.families
    const familyKeys = Object.keys(data.families);
    for (const [key, variant] of Object.entries(data.variants)) {
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
    const weightKeys = Object.keys(data.weights);
    for (const [key, variant] of Object.entries(data.variants)) {
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
