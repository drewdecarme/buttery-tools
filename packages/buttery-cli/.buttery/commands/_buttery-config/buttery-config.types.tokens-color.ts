// Helper type to create an array of numbers from 0 to N-1
type BuildArray<
  N extends number,
  R extends unknown[] = [],
> = R["length"] extends N ? R : BuildArray<N, [...R, unknown]>;

// Helper type to get the length of an array as a number
type Length<T extends unknown[]> = T["length"];

// Main type to build the union of numbers between Start and End (inclusive)
type Range<
  Start extends number,
  End extends number,
  R extends unknown[] = BuildArray<Start>,
> =
  Length<R> extends End
    ? End | Start
    : Length<R> | Range<Start, End, [...R, unknown]>;

// TODO: Clean up these types
export type ButteryTokensColorHarmonious = {
  mode: "harmonious";
  saturation: number;
  brightness: number;
  application: {
    hues: { [key: string]: number };
  };
  neutral: ButteryTokensColorNeutral;
  /**
   * Extra colors that don't require variants. These are static
   * since they stay the same and cannot be varied
   */
  static?: ButteryTokensColorStatic;
}; // TODO: Break this out in hsl
export type ButteryTokensColorPresetJewel = {
  tone: "jewel";
  saturation: Range<73, 83>;
  brightness: Range<56, 76>;
};
export type ButteryTokensColorPresetPastel = {
  tone: "pastel";
  saturation: Range<14, 21>;
  brightness: Range<89, 96>;
};
export type ButteryTokensColorPresetEarth = {
  tone: "earth";
  saturation: Range<36, 41>;
  brightness: Range<36, 77>;
};
export type ButteryTokensColorPresetNeutral = {
  tone: "neutral";
  saturation: Range<1, 4>;
  brightness: Range<58, 99>;
};
export type ButteryTokensColorPresetFluorescent = {
  tone: "fluorescent";
  saturation: Range<63, 100>;
  brightness: Range<82, 100>;
};
export type ButteryTokensColorPreset =
  | ButteryTokensColorPresetJewel
  | ButteryTokensColorPresetPastel
  | ButteryTokensColorPresetEarth
  | ButteryTokensColorPresetNeutral
  | ButteryTokensColorPresetFluorescent;

export type ButteryTokensColorVariantsAuto = {
  /**
   * The variant mode. "auto" will ask for presets to automatically
   * derive and create the application color scales for you.
   */
  mode: "auto";
  /**
   * The number of application variants that should be created
   * @default 10
   */
  total?: number;
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
export type ButteryTokensColorVariantsManual = {
  mode: "manual";
  [variantName: string]: string;
};

export type ButteryTokensColorStatic = { [colorName: string]: string };
export type ButteryTokensColorNeutral = {
  /**
   * The base or darkest color for your neutral color. Best practice
   * dictates that this should be an off black that should match the
   * relative tone of your primary color. This will be used with it's
   * variants as the "darkest" color and a variant config of auto mode
   * will create a scale that adds more lightness to it
   */
  base: string;
  /**
   * Information about how the variants
   * will be created
   */
  variants: ButteryTokensColorVariantsAuto | ButteryTokensColorVariantsManual;
};

export type ButteryTokensColorPresets = {
  mode: "presets";
  application: {
    hues: { [key: string]: number };
    /**
     * Information about how the variants
     * will be created
     */
    variants: ButteryTokensColorVariantsAuto | ButteryTokensColorVariantsManual;
  };
  neutral: ButteryTokensColorNeutral;
  /**
   * Extra colors that don't require variants. These are static
   * since they stay the same and cannot be varied
   */
  static?: ButteryTokensColorStatic;
} & ButteryTokensColorPreset;

export type ButteryTokensColor =
  | ButteryTokensColorHarmonious
  | ButteryTokensColorPresets;

// Defaults
type ColorPresetToneDefault<T extends ButteryTokensColorPreset> = Omit<
  T,
  "tone"
> & {
  min: Omit<T, "tone">;
  max: Omit<T, "tone">;
};
const butteryConfigColorPresetDefaultJewel: ColorPresetToneDefault<ButteryTokensColorPresetJewel> =
  {
    saturation: 73,
    brightness: 56,
    min: {
      saturation: 73,
      brightness: 56,
    },
    max: {
      saturation: 83,
      brightness: 76,
    },
  };
const butteryConfigColorPresetDefaultPastel: ColorPresetToneDefault<ButteryTokensColorPresetPastel> =
  {
    saturation: 14,
    brightness: 89,
    min: {
      saturation: 14,
      brightness: 89,
    },
    max: {
      saturation: 21,
      brightness: 96,
    },
  };
const butteryConfigColorPresetDefaultEarth: ColorPresetToneDefault<ButteryTokensColorPresetEarth> =
  {
    saturation: 36,
    brightness: 36,
    min: {
      saturation: 36,
      brightness: 36,
    },
    max: {
      saturation: 41,
      brightness: 77,
    },
  };
const butteryConfigColorPresetDefaultNeutral: ColorPresetToneDefault<ButteryTokensColorPresetNeutral> =
  {
    saturation: 1,
    brightness: 58,
    min: {
      saturation: 1,
      brightness: 58,
    },
    max: {
      saturation: 4,
      brightness: 99,
    },
  };
const butteryConfigColorPresetDefaultFluorescent: ColorPresetToneDefault<ButteryTokensColorPresetFluorescent> =
  {
    saturation: 63,
    brightness: 82,
    min: {
      saturation: 63,
      brightness: 82,
    },
    max: {
      saturation: 100,
      brightness: 100,
    },
  };

export const butteryConfigColorDefaultsPreset = {
  earth: butteryConfigColorPresetDefaultEarth,
  jewel: butteryConfigColorPresetDefaultJewel,
  pastel: butteryConfigColorPresetDefaultPastel,
  neutral: butteryConfigColorPresetDefaultNeutral,
  fluorescent: butteryConfigColorPresetDefaultFluorescent,
};
export const butteryConfigColorDefaultsPresets: ButteryTokensColorPresets = {
  mode: "presets",
  tone: "jewel",
  ...butteryConfigColorDefaultsPreset.jewel,
  application: {
    hues: {
      primary: 203,
    },
    variants: {
      mode: "auto",
    },
  },
  neutral: {
    base: "#000000",
    variants: {
      mode: "auto",
    },
  },
};
export const butteryConfigColorDefaultsHarmonious: ButteryTokensColorHarmonious =
  {
    mode: "harmonious",
    saturation: 83,
    brightness: 76,
    application: {
      hues: {
        primary: 203,
      },
    },
    neutral: {
      base: "#000000",
      variants: {
        mode: "auto",
      },
    },
  };
