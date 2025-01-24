import { z } from "zod";

const ColorVariantTypeAutoSchema = z.number();
export type ColorVariantTypeAuto = z.infer<typeof ColorVariantTypeAutoSchema>;
const ColorVariantTypeNamedSchema = z.string().array();
export type ColorVariantTypeNamed = z.infer<typeof ColorVariantTypeNamedSchema>;
const ColorVariantTypeKeyValueSchema = z.record(z.string(), z.string());
export type ColorVariantTypeKeyValue = z.infer<
  typeof ColorVariantTypeKeyValueSchema
>;

export const ColorVariantTypesSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("auto"), variant: ColorVariantTypeAutoSchema }),
  z.object({
    type: z.literal("auto-named"),
    variant: ColorVariantTypeNamedSchema,
  }),
  z.object({
    type: z.literal("key-value"),
    variant: ColorVariantTypeKeyValueSchema,
  }),
]);
export type ColorVariantTypes = z.infer<typeof ColorVariantTypesSchema>;

const ColorVariantBaseSchema = z.union([
  ColorVariantTypeAutoSchema,
  ColorVariantTypeNamedSchema,
]);
const ColorVariantAutoSchema = ColorVariantBaseSchema;
export type ButteryTokensColorVariantBase = z.infer<
  typeof ColorVariantAutoSchema
>;

const ColorVariantManualSchema = ColorVariantBaseSchema.or(
  ColorVariantTypeKeyValueSchema
);

// we use the manual schema since it has the union of all of the variations we need
export type ButteryTokensColorVariant = z.infer<
  typeof ColorVariantManualSchema
>;

export const ColorDefHueSchema = z.record(
  z.string(),
  z.object({
    hue: z.number().min(0).max(360),
    variants: ColorVariantAutoSchema,
  })
);
export type ButteryTokensColorDefHue = z.infer<typeof ColorDefHueSchema>;

export const ColorDefHexSchema = z.record(
  z.string(),
  z.object({
    hex: z.string(),
    variants: ColorVariantManualSchema,
  })
);
export type ButteryTokensColorDefHex = z.infer<typeof ColorDefHexSchema>;

// Brand Categories
export const ColorBrandTypeJewelSchema = z.object({
  type: z.literal("jewel"),
  colors: ColorDefHueSchema,
  saturation: z.union([
    z.literal(73),
    z.literal(74),
    z.literal(75),
    z.literal(76),
    z.literal(77),
    z.literal(78),
    z.literal(79),
    z.literal(80),
    z.literal(81),
    z.literal(82),
    z.literal(83),
  ]),
  brightness: z.union([
    z.literal(56),
    z.literal(57),
    z.literal(58),
    z.literal(59),
    z.literal(60),
    z.literal(61),
    z.literal(62),
    z.literal(63),
    z.literal(64),
    z.literal(65),
    z.literal(66),
    z.literal(67),
    z.literal(68),
    z.literal(69),
    z.literal(70),
    z.literal(71),
    z.literal(72),
    z.literal(73),
    z.literal(74),
    z.literal(75),
    z.literal(76),
  ]),
});

export const ColorBrandTypePastelSchema = z.object({
  type: z.literal("pastel"),
  colors: ColorDefHueSchema,
  saturation: z.union([
    z.literal(14),
    z.literal(15),
    z.literal(16),
    z.literal(17),
    z.literal(18),
    z.literal(19),
    z.literal(20),
    z.literal(21),
  ]),
  brightness: z.union([
    z.literal(89),
    z.literal(90),
    z.literal(91),
    z.literal(92),
    z.literal(93),
    z.literal(94),
    z.literal(95),
    z.literal(96),
  ]),
});

export const ColorBrandTypeEarthSchema = z.object({
  type: z.literal("earth"),
  colors: ColorDefHueSchema,
  saturation: z.union([
    z.literal(36),
    z.literal(37),
    z.literal(38),
    z.literal(39),
    z.literal(40),
    z.literal(41),
  ]),
  brightness: z.union([
    z.literal(36),
    z.literal(37),
    z.literal(38),
    z.literal(39),
    z.literal(40),
    z.literal(41),
    z.literal(42),
    z.literal(43),
    z.literal(44),
    z.literal(45),
    z.literal(46),
    z.literal(47),
    z.literal(48),
    z.literal(49),
    z.literal(50),
    z.literal(51),
    z.literal(52),
    z.literal(53),
    z.literal(54),
    z.literal(55),
    z.literal(56),
    z.literal(57),
    z.literal(58),
    z.literal(59),
    z.literal(60),
    z.literal(61),
    z.literal(62),
    z.literal(63),
    z.literal(64),
    z.literal(65),
    z.literal(66),
    z.literal(67),
    z.literal(68),
    z.literal(69),
    z.literal(70),
    z.literal(71),
    z.literal(72),
    z.literal(73),
    z.literal(74),
    z.literal(75),
    z.literal(76),
    z.literal(77),
  ]),
});

export const ColorBrandTypeNeutralSchema = z.object({
  type: z.literal("neutral"),
  colors: ColorDefHueSchema,
  saturation: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  brightness: z.union([
    z.literal(58),
    z.literal(59),
    z.literal(60),
    z.literal(61),
    z.literal(62),
    z.literal(63),
    z.literal(64),
    z.literal(65),
    z.literal(66),
    z.literal(67),
    z.literal(68),
    z.literal(69),
    z.literal(70),
    z.literal(71),
    z.literal(72),
    z.literal(73),
    z.literal(74),
    z.literal(75),
    z.literal(76),
    z.literal(77),
    z.literal(78),
    z.literal(79),
    z.literal(80),
    z.literal(81),
    z.literal(82),
    z.literal(83),
    z.literal(84),
    z.literal(85),
    z.literal(86),
    z.literal(87),
    z.literal(88),
    z.literal(89),
    z.literal(90),
    z.literal(91),
    z.literal(92),
    z.literal(93),
    z.literal(94),
    z.literal(95),
    z.literal(96),
    z.literal(97),
    z.literal(98),
    z.literal(99),
  ]),
});

export const ColorBrandTypeFluorescentSchema = z.object({
  type: z.literal("fluorescent"),
  colors: ColorDefHueSchema,
  saturation: z.union([
    z.literal(63),
    z.literal(64),
    z.literal(65),
    z.literal(66),
    z.literal(67),
    z.literal(68),
    z.literal(69),
    z.literal(70),
    z.literal(71),
    z.literal(72),
    z.literal(73),
    z.literal(74),
    z.literal(75),
    z.literal(76),
    z.literal(77),
    z.literal(78),
    z.literal(79),
    z.literal(80),
    z.literal(81),
    z.literal(82),
    z.literal(83),
    z.literal(84),
    z.literal(85),
    z.literal(86),
    z.literal(87),
    z.literal(88),
    z.literal(89),
    z.literal(90),
    z.literal(91),
    z.literal(92),
    z.literal(93),
    z.literal(94),
    z.literal(95),
    z.literal(96),
    z.literal(97),
    z.literal(98),
    z.literal(99),
    z.literal(100),
  ]),
  brightness: z.union([
    z.literal(82),
    z.literal(83),
    z.literal(84),
    z.literal(85),
    z.literal(86),
    z.literal(87),
    z.literal(88),
    z.literal(89),
    z.literal(90),
    z.literal(91),
    z.literal(92),
    z.literal(93),
    z.literal(94),
    z.literal(95),
    z.literal(96),
    z.literal(97),
    z.literal(98),
    z.literal(99),
    z.literal(100),
  ]),
});

const ColorBrandTypeManualSchema = z.object({
  type: z.literal("manual"),
  colors: ColorDefHexSchema,
});
export type ButteryTokensColorBrandTypeManual = z.infer<
  typeof ColorBrandTypeManualSchema
>;

export const ColorBrandTypeAutoSchema = z.discriminatedUnion("type", [
  ColorBrandTypeFluorescentSchema,
  ColorBrandTypeJewelSchema,
  ColorBrandTypePastelSchema,
  ColorBrandTypeEarthSchema,
  ColorBrandTypeNeutralSchema,
]);
export type ButteryTokensColorBrandTypeAuto = z.infer<
  typeof ColorBrandTypeAutoSchema
>;

const ColorBrandSchema = z.discriminatedUnion("type", [
  ColorBrandTypeManualSchema,
  ColorBrandTypeFluorescentSchema,
  ColorBrandTypeJewelSchema,
  ColorBrandTypePastelSchema,
  ColorBrandTypeEarthSchema,
  ColorBrandTypeNeutralSchema,
]);

export type ButteryTokensColorBrand = z.infer<typeof ColorBrandSchema>;

const ColorNeutralSchema = z.record(
  z.string(),
  z.union([z.string(), ColorDefHexSchema.valueSchema])
);
export type ButteryTokensColorNeutral = z.infer<typeof ColorNeutralSchema>;

export const ColorSchema = z
  .object({
    brand: ColorBrandSchema.default({
      type: "manual",
      colors: {},
    }),
    neutral: ColorNeutralSchema.default({}),
  })
  .default({});
export type ButteryTokensColor = z.infer<typeof ColorSchema>;

// const testManual: ButteryTokensColor = {
//   brand: {
//     type: "manual",
//     colors: {
//       primary: {
//         hex: "#030305",
//         // variants: 10,
//         variants: ["50", "100", "200"], // array (auto name)
//       },
//     },
//   },
//   neutral: {
//     background: "#fff",
//     surface: "#fff",
//     neutral: {
//       hex: "#030305",
//       // variants: 10, // number (auto color & name)
//       // variants: ["50", "100", "200"], // array (auto name)
//       variants: {
//         // object (full control over name and color)
//         "50": "#ccc",
//         "100": "#eee",
//       },
//     },
//   },
// };

// const testTone: ButteryTokensColor = {
//   brand: {
//     type: "fluorescent",
//     saturation: 82,
//     brightness: 90,
//     colors: {
//       primary: {
//         hue: 47,
//         variants: 10, // number (auto color & name)
//       },
//       secondary: {
//         hue: 170,
//         variants: ["50", "100", "200"], // array (auto name)
//       },
//       warning: {
//         hue: 60, // hue or hex (hex is available in )
//         variants: 6,
//       },
//     },
//   },
// };
