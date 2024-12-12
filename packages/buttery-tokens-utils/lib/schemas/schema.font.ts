import { z } from "zod";

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
    baseSize: FontBaseSizeSchema.default(16),
    families: FontFamiliesSchema.default({
      heading: "system-ui",
      body: "system-ui",
    }),
    fallback: FontFallbackSchema.default(
      'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
    ),
    weights: FontWeightsSchema.default({ normal: 400 }),
    variants: FontVariantsSchema.default({
      textPrimary: {
        family: "system-ui",
        weight: "normal",
        lineHeight: 1.3,
        size: 16,
      },
    }),
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
export type ButteryTokensConfigFont = z.infer<typeof FontSchema>;
