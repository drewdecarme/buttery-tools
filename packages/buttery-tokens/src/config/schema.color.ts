import { z } from "zod";

const butteryTokensColorBrandVariantBaseSchema = z.union([
  z.number(),
  z.string().array(),
]);
const butteryTokensColorBrandVariantAutoSchema =
  butteryTokensColorBrandVariantBaseSchema;

const butteryTokensColorBrandVariantManualSchema =
  butteryTokensColorBrandVariantBaseSchema.or(z.record(z.string(), z.string()));

const butteryTokensColorToneSchema = z.object({
  colors: z.record(
    z.string(),
    z.object({
      hue: z.number().min(0).max(60),
      variants: butteryTokensColorBrandVariantAutoSchema,
    })
  ),
});

// Brand Categories
const butteryTokensConfigColorBrandTypeJewelSchema = z
  .object({
    type: z.literal("jewel"),
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
  })
  .merge(butteryTokensColorToneSchema);

const butteryTokensConfigColorBrandTypePastelSchema = z
  .object({
    type: z.literal("pastel"),
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
  })
  .merge(butteryTokensColorToneSchema);

const butteryTokensConfigColorBrandTypeEarthSchema = z
  .object({
    type: z.literal("earth"),
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
  })
  .merge(butteryTokensColorToneSchema);

const butteryTokensConfigColorBrandTypeNeutralSchema = z
  .object({
    type: z.literal("neutral"),
    saturation: z.union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
    ]),
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
  })
  .merge(butteryTokensColorToneSchema);

const butteryTokensConfigColorBrandTypeFluorescentSchema = z
  .object({
    type: z.literal("fluorescent"),
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
  })
  .merge(butteryTokensColorToneSchema);

const butteryTokensConfigColorBrandTypeManualSchema = z.object({
  type: z.literal("manual"),
  colors: z.record(
    z.string(),
    z.object({
      hex: z.string(),
      variants: butteryTokensColorBrandVariantManualSchema,
    })
  ),
});

const butteryTokensConfigColorBrandSchema = z.discriminatedUnion("type", [
  butteryTokensConfigColorBrandTypeManualSchema,
  butteryTokensConfigColorBrandTypeJewelSchema,
  butteryTokensConfigColorBrandTypePastelSchema,
  butteryTokensConfigColorBrandTypeEarthSchema,
  butteryTokensConfigColorBrandTypeNeutralSchema,
  butteryTokensConfigColorBrandTypeFluorescentSchema,
]);

const butteryTokensConfigColorNeutralSchema = z.record(
  z.string(),
  z.union([
    z.string(),
    z.object({
      hex: z.string(),
      variants: butteryTokensColorBrandVariantManualSchema,
    }),
  ])
);

export const butteryTokensConfigColorSchema = z.object({
  brand: z.preprocess(
    (value) =>
      value ?? {
        type: "manual",
        colors: {},
      },
    butteryTokensConfigColorBrandSchema.optional()
  ),
  neutral: z.preprocess(
    (value) => value ?? {},
    butteryTokensConfigColorNeutralSchema.optional()
  ),
});

export type ButteryTokensConfigColor = z.infer<
  typeof butteryTokensConfigColorSchema
>;
export type ButteryTokensConfigColorWellFormed =
  Required<ButteryTokensConfigColor>;

// const testManual: ButteryTokensConfigColor = {
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

// const testTone: ButteryTokensConfigColor = {
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
