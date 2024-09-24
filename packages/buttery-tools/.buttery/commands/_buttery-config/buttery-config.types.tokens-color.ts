// Helper type to create an array of numbers from 0 to N-1
type BuildArray<
  N extends number,
  R extends unknown[] = []
> = R["length"] extends N ? R : BuildArray<N, [...R, unknown]>;

// Helper type to get the length of an array as a number
type Length<T extends unknown[]> = T["length"];

// Main type to build the union of numbers between Start and End (inclusive)
type HSLRange<
  Start extends number,
  End extends number,
  R extends unknown[] = BuildArray<Start>
> = Length<R> extends End
  ? End | Start
  : Length<R> | HSLRange<Start, End, [...R, unknown]>;

type HEX = string;

// ------------ Brand ------------
export type ButteryTokensColorBrandVariantsManual = {
  mode: "manual";
  [variantName: string]: string;
};
export type ButteryTokensColorBrandVariantsAuto = {
  mode: "auto";
  /**
   * The number of application variants that should be created
   * @default 10
   */
  numOfVariants: number;
  /**
   * The lightness factor of the derived scale. A higher value
   * creates a lighter variant floor
   * @default 2
   */
  scaleMin?: number;
  /**
   * The darkness factor of the derived scale. A higher number
   * creates a darker variant ceiling
   * @default 2
   */
  scaleMax?: number;
};
export type ButteryTokensColorBrandVariants =
  | ButteryTokensColorBrandVariantsAuto
  | ButteryTokensColorBrandVariantsManual;
export type ButteryTokensColorBrandCategoryJewel = {
  tone: "jewel";
  saturation: HSLRange<73, 83>;
  brightness: HSLRange<56, 76>;
};
export type ButteryTokensColorBrandCategoryPastel = {
  tone: "pastel";
  saturation: HSLRange<14, 21>;
  brightness: HSLRange<89, 96>;
};
export type ButteryTokensColorBrandCategoryEarth = {
  tone: "earth";
  saturation: HSLRange<36, 41>;
  brightness: HSLRange<36, 77>;
};
export type ButteryTokensColorBrandCategoryNeutral = {
  tone: "neutral";
  saturation: HSLRange<1, 4>;
  brightness: HSLRange<58, 99>;
};
export type ButteryTokensColorBrandCategoryFluorescent = {
  tone: "fluorescent";
  saturation: HSLRange<63, 100>;
  brightness: HSLRange<82, 100>;
};
export type ButteryTokensColorBrandCategories =
  | ButteryTokensColorBrandCategoryJewel
  | ButteryTokensColorBrandCategoryPastel
  | ButteryTokensColorBrandCategoryEarth
  | ButteryTokensColorBrandCategoryNeutral
  | ButteryTokensColorBrandCategoryFluorescent;

export type ButteryTokensColorBrandCategory = {
  mode: "category";
  /**
   * The hues or the visible colors that you want.
   * Max is 360 since hues are placed on the color wheel
   * and there's only 360° on a circle.
   */
  hues: { [hueName: string]: number };
  variants: ButteryTokensColorBrandVariants;
} & ButteryTokensColorBrandCategories;

export type ButteryTokensColorBrandManual = {
  mode: "manual";
  variants: ButteryTokensColorBrandVariants;
  values: { [brandColorName: string]: HEX };
};

export type ButteryTokensColorBrand =
  | ButteryTokensColorBrandCategory
  | ButteryTokensColorBrandManual;

// ------------ SHADE ------------
export type ButteryTokensColorShadeVariantAuto = {
  /**
   * Automatically derive the variants that you'll use
   * when you use the utilities. This mode is good to use
   * if you don't have a design team or a set amount of variants
   * that you want to use.
   */
  mode: "auto";
  /**
   * The number of variants that should be auto generated
   * with your base color being the first variant.
   */
  numOfVariants: number;
  /**
   * The lightness factor of the derived scale. A higher value
   * creates a lighter variant floor
   * @default 5
   */
  scaleMin?: number;
};
export type ButteryTokensColorShadeVariantManual = {
  /**
   * Take individual control over the variants that you
   * want to create for your shade. Using this option
   * also allows you to create the variant names. This is a
   * good option to use if you have a design team that already
   * created these variants.
   */
  mode: "manual";
} & { [variantName: string]: HEX };
export type ButteryTokensColorShadeVariants =
  | ButteryTokensColorShadeVariantAuto
  | ButteryTokensColorShadeVariantManual;
export type ButteryTokensColorShade = {
  values: { [shadeName: string]: HEX };
  variants: ButteryTokensColorShadeVariants;
};

// ------------ Static ------------
export type ButteryTokensColorStatic = { [staticColorName: string]: string };

export type ButteryTokensColor = {
  /**
   * Brand colors are the colors that give your application it's appearance in
   * accordance with the brand that is set out by either the design team or
   * your own feelings.
   */
  brand: ButteryTokensColorBrand;
  /**
   * Shade colors are based upon a dark shade which is a derivation of the tone
   * of the base brand color. Variants will start from the base color and then
   * add a set amount of lightness
   */
  shade: ButteryTokensColorShade;
  /**
   * Static colors that don't change. These can be used for foreground,
   * background, lines, etc...
   */
  static?: ButteryTokensColorStatic;
};
