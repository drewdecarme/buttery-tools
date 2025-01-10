import { z } from "zod";

export const fontFamilyFallback =
  'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

export const ManualFontStylesValueSchema = z.object({
  "thin-100": z.literal("Thin 100"),
  "thin-100-italic": z.literal("Thin 100 - Italic"),
  "extraLight-200": z.literal("ExtraLight 200"),
  "extraLight-200-italic": z.literal("ExtraLight 200 - Italic"),
  "light-300": z.literal("Light 300"),
  "light-300-italic": z.literal("Light 300 - Italic"),
  "regular-400": z.literal("Regular 300"),
  "regular-400-italic": z.literal("Regular 300 - Italic"),
  "medium-500": z.literal("Medium 500"),
  "medium-500-italic": z.literal("Medium 500 - Italic"),
  "semiBold-600": z.literal("SemiBold 600"),
  "semiBold-600-italic": z.literal("SemiBold 600 - Italic"),
  "bold-700": z.literal("Bold 700"),
  "bold-700-italic": z.literal("Bold 700 - Italic"),
  "extraBold-800": z.literal("Bold 800"),
  "extraBold-800-italic": z.literal("Bold 800 - Italic"),
  "black-900": z.literal("Black 900"),
  "black-900-italic": z.literal("Black 900 - Italic"),
});
type ManualFontStylesValue = z.infer<typeof ManualFontStylesValueSchema>;

export const manualFontStyles: ManualFontStylesValue = {
  "thin-100": "Thin 100",
  "thin-100-italic": "Thin 100 - Italic",
  "extraLight-200": "ExtraLight 200",
  "extraLight-200-italic": "ExtraLight 200 - Italic",
  "light-300": "Light 300",
  "light-300-italic": "Light 300 - Italic",
  "regular-400": "Regular 300",
  "regular-400-italic": "Regular 300 - Italic",
  "medium-500": "Medium 500",
  "medium-500-italic": "Medium 500 - Italic",
  "semiBold-600": "SemiBold 600",
  "semiBold-600-italic": "SemiBold 600 - Italic",
  "bold-700": "Bold 700",
  "bold-700-italic": "Bold 700 - Italic",
  "extraBold-800": "Bold 800",
  "extraBold-800-italic": "Bold 800 - Italic",
  "black-900": "Black 900",
  "black-900-italic": "Black 900 - Italic",
};

export const ManualFontStylesSchema = z.record(
  ManualFontStylesValueSchema.keyof(),
  z.boolean()
);
export type ManualFontStyles = z.infer<typeof ManualFontStylesSchema>;

const FontFamiliesManualSchema = z.record(
  z.string(),
  z.object({
    fallback: z.string().optional().default(fontFamilyFallback),
    styles: ManualFontStylesSchema,
  })
);

const FontFamiliesGoogleSchema = z.union([
  z.record(
    z.literal("google-font-1"),
    z.object({
      fallback: z.string().default(fontFamilyFallback),
      styles: z.array(
        z.literal("google-font-1-style-1"),
        z.literal("google-font-1-style-2")
      ),
    })
  ),
  z.record(
    z.literal("google-font-2"),
    z.object({
      styles: z.array(
        z.literal("google-font-2-style-1"),
        z.literal("google-font-2-style-2")
      ),
    })
  ),
]);

const FontFamiliesAdobeSchema = z.union([
  z.record(
    z.literal("adobe-font-1"),
    z.object({
      fallback: z.string().default(fontFamilyFallback),
      styles: z.array(
        z.literal("adobe-font-1-style-1"),
        z.literal("adobe-font-1-style-2")
      ),
    })
  ),
  z.record(
    z.literal("adobe-font-2"),
    z.object({
      styles: z.array(
        z.literal("adobe-font-2-style-1"),
        z.literal("adobe-font-2-style-2")
      ),
    })
  ),
]);

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
  .discriminatedUnion("source", [
    z.object({
      source: z.literal("manual"),
      families: FontFamiliesManualSchema,
      variants: FontVariantsSchema,
    }),
    z.object({
      source: z.literal("google"),
      families: FontFamiliesGoogleSchema,
      variants: FontVariantsSchema,
    }),
    z.object({
      source: z.literal("adobe"),
      families: FontFamiliesAdobeSchema,
      variants: FontVariantsSchema,
    }),
  ])
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
  })
  .default({ source: "manual", families: {}, variants: {} });

export type ButteryTokensConfigFont = z.infer<typeof FontSchema>;
