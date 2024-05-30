// Helper type to create an array of numbers from 0 to N-1
type BuildArray<
  N extends number,
  R extends unknown[] = []
> = R["length"] extends N ? R : BuildArray<N, [...R, unknown]>;

// Helper type to get the length of an array as a number
type Length<T extends unknown[]> = T["length"];

// Main type to build the union of numbers between Start and End (inclusive)
type Range<
  Start extends number,
  End extends number,
  R extends unknown[] = BuildArray<Start>
> = Length<R> extends End
  ? End | Start
  : Length<R> | Range<Start, End, [...R, unknown]>;

export type ButteryTokensColorHarmonious = {
  mode: "harmonious";
  saturation: number;
  brightness: number;
  hues: { [key: string]: number };
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

export type ButteryTokensColorPresets = {
  mode: "presets";
  hues: { [key: string]: number };
} & ButteryTokensColorPreset;

export type ButteryTokensColor = {
  /**
   * If defined, this key determines how variants
   * will automatically be created
   */
  variants?: {
    /**
     * The number of variants that will be automatically
     * created based upon the selected colors
     * @default 8
     */
    total: number;
  };
  neutral: string;
} & (ButteryTokensColorHarmonious | ButteryTokensColorPresets);

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
      brightness: 56
    },
    max: {
      saturation: 83,
      brightness: 76
    }
  };
const butteryConfigColorPresetDefaultPastel: ColorPresetToneDefault<ButteryTokensColorPresetPastel> =
  {
    saturation: 14,
    brightness: 89,
    min: {
      saturation: 14,
      brightness: 89
    },
    max: {
      saturation: 21,
      brightness: 96
    }
  };
const butteryConfigColorPresetDefaultEarth: ColorPresetToneDefault<ButteryTokensColorPresetEarth> =
  {
    saturation: 36,
    brightness: 36,
    min: {
      saturation: 36,
      brightness: 36
    },
    max: {
      saturation: 41,
      brightness: 77
    }
  };
const butteryConfigColorPresetDefaultNeutral: ColorPresetToneDefault<ButteryTokensColorPresetNeutral> =
  {
    saturation: 1,
    brightness: 58,
    min: {
      saturation: 1,
      brightness: 58
    },
    max: {
      saturation: 4,
      brightness: 99
    }
  };
const butteryConfigColorPresetDefaultFluorescent: ColorPresetToneDefault<ButteryTokensColorPresetFluorescent> =
  {
    saturation: 63,
    brightness: 82,
    min: {
      saturation: 63,
      brightness: 82
    },
    max: {
      saturation: 100,
      brightness: 100
    }
  };

export const butteryConfigColorDefaultsPreset = {
  earth: butteryConfigColorPresetDefaultEarth,
  jewel: butteryConfigColorPresetDefaultJewel,
  pastel: butteryConfigColorPresetDefaultPastel,
  neutral: butteryConfigColorPresetDefaultNeutral,
  fluorescent: butteryConfigColorPresetDefaultFluorescent
};
export const butteryConfigColorDefaultsPresets: ButteryTokensColorPresets = {
  mode: "presets",
  tone: "jewel",
  ...butteryConfigColorDefaultsPreset.jewel,
  hues: {
    primary: 203
  }
};
export const butteryConfigColorDefaultsHarmonious: ButteryTokensColorHarmonious =
  {
    mode: "harmonious",
    saturation: 83,
    brightness: 76,
    hues: {
      primary: 203
    }
  };
