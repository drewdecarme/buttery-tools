import { z } from "zod";

import { optionalSchema } from "./schema-utils.js";

/**
 * The base font-size
 */
const FontBaseSizeSchema = z.number();
/**
 * A record of key/value strings that will be variables that can be used as the font families.
 * You can have as many as you want but a good guidance would be
 * 1. `heading`
 * 2. `body`
 */
const FontFamiliesSchema = z.record(z.string(), z.string());
/**
 * A fallback for font families that don't render
 */
const FontFallbackSchema = z.string();
/**
 * A record of key/value strings that will be variables that can be used as the font weights.
 * You can have as many as you want but a good guidance would be
 * 1. `light`
 * 2. `regular`
 * 2. `semi-bold`
 * 2. `bold`
 * 2. `black`
 */
const FontWeightsSchema = z.record(z.string(), z.number());
const FontVariantsSchema = z.record(
  z.string(),
  z.object({
    family: z.string(),
    weight: z.string(),
    size: z.number(),
    lineHeight: z.number(),
  })
);
export const FontSchema = z
  .object({
    baseSize: optionalSchema(FontBaseSizeSchema, 16),
    families: optionalSchema(FontFamiliesSchema, {}),
    fallback: optionalSchema(
      FontFallbackSchema,
      'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
    ),
    weights: optionalSchema(FontWeightsSchema, {}),
    variants: optionalSchema(FontVariantsSchema, {}),
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
  })
  .default({});
export type ButteryTokensConfigFont = z.infer<typeof FontSchema>;
