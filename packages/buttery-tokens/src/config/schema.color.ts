import { z } from "zod";

// HEX type
const HEX = z.string();

// Brand Variants
const ButteryTokensColorSchemaBrandVariantsManual = z
  .object({
    mode: z.literal("manual"),
  })
  .catchall(z.string());

const ButteryTokensColorSchemaBrandVariantsAuto = z.object({
  mode: z.literal("auto"),
  numOfVariants: z.number().default(10),
  scaleMin: z.number().optional().default(2),
  scaleMax: z.number().optional().default(2),
});

const ButteryTokensColorSchemaBrandVariants = z.union([
  ButteryTokensColorSchemaBrandVariantsManual,
  ButteryTokensColorSchemaBrandVariantsAuto,
]);

// Brand Categories
const ButteryTokensColorSchemaBrandCategoryJewel = z.object({
  tone: z.literal("jewel"),
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

const ButteryTokensColorSchemaBrandCategoryPastel = z.object({
  tone: z.literal("pastel"),
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

const ButteryTokensColorSchemaBrandCategoryEarth = z.object({
  tone: z.literal("earth"),
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

const ButteryTokensColorSchemaBrandCategoryNeutral = z.object({
  tone: z.literal("neutral"),
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

const ButteryTokensColorSchemaBrandCategoryFluorescent = z.object({
  tone: z.literal("fluorescent"),
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

const ButteryTokensColorSchemaBrandCategories = z.union([
  ButteryTokensColorSchemaBrandCategoryJewel,
  ButteryTokensColorSchemaBrandCategoryPastel,
  ButteryTokensColorSchemaBrandCategoryEarth,
  ButteryTokensColorSchemaBrandCategoryNeutral,
  ButteryTokensColorSchemaBrandCategoryFluorescent,
]);

const ButteryTokensColorSchemaBrandCategory = z
  .object({
    mode: z.literal("category"),
    hues: z.record(z.number().min(0).max(360)),
    variants: ButteryTokensColorSchemaBrandVariants,
  })
  .and(ButteryTokensColorSchemaBrandCategories);

// Brand Manual
const ButteryTokensColorSchemaBrandManual = z.object({
  mode: z.literal("manual"),
  variants: ButteryTokensColorSchemaBrandVariants,
  values: z.record(HEX),
});

const ButteryTokensColorSchemaBrand = z.union([
  ButteryTokensColorSchemaBrandCategory,
  ButteryTokensColorSchemaBrandManual,
]);

// Shade Variants
const ButteryTokensColorSchemaShadeVariantAuto = z.object({
  mode: z.literal("auto"),
  numOfVariants: z.number(),
  scaleMin: z.number().optional().default(5),
});

const ButteryTokensColorSchemaShadeVariantManual = z
  .object({
    mode: z.literal("manual"),
  })
  .catchall(HEX);

const ButteryTokensColorSchemaShadeVariants = z.union([
  ButteryTokensColorSchemaShadeVariantAuto,
  ButteryTokensColorSchemaShadeVariantManual,
]);

const ButteryTokensColorSchemaShade = z.object({
  values: z.record(HEX),
  variants: ButteryTokensColorSchemaShadeVariants,
});

// Static
const ButteryTokensColorSchemaStatic = z.record(z.string());

export const ButteryTokensColorSchema = z.object({
  brand: ButteryTokensColorSchemaBrand,
  shade: ButteryTokensColorSchemaShade,
  static: ButteryTokensColorSchemaStatic.optional(),
});
export type ButteryTokensColor = z.infer<typeof ButteryTokensColorSchema>;
