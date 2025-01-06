import { exhaustiveMatchGuard } from "@buttery/components";
import { calculateSpaceVariantsAuto } from "@buttery/tokens-utils";
import type {
  ColorDefHueSchema,
  ButteryTokensConfig,
  ColorDefHexSchema,
  ButteryTokensColorBrandTypeAuto,
  ButteryTokensColorBrandTypeManual,
  SpaceAuto,
  SpaceManual,
  ButteryTokensConfigSpaceAndSize,
} from "@buttery/tokens-utils/schemas";
import {
  ColorBrandTypeEarthSchema,
  ColorBrandTypeFluorescentSchema,
  ColorBrandTypeJewelSchema,
  ColorBrandTypeNeutralSchema,
  ColorBrandTypePastelSchema,
  ConfigSchema,
} from "@buttery/tokens-utils/schemas";
import { generateGUID } from "@buttery/utils/isomorphic";
import type { z, ZodLiteral, ZodUnionDef } from "zod";

export const initConfig: ButteryTokensConfig = ConfigSchema.parse({});

export type ConfigurationStateColorsAuto = {
  [id: string]: z.infer<typeof ColorDefHueSchema.valueSchema> & {
    name: string;
  };
};
export type ConfigurationStateColorsManual = {
  [id: string]: z.infer<typeof ColorDefHexSchema.valueSchema> & {
    name: string;
  };
};
export type ConfigurationStateColorBrandAuto =
  ButteryTokensColorBrandTypeAuto & {
    colors: ConfigurationStateColorsAuto;
  };
export type ConfigurationStateColorBrandManual =
  ButteryTokensColorBrandTypeManual & {
    colors: ConfigurationStateColorsManual;
  };
export type ConfigurationStateColorBrand = {
  auto: ConfigurationStateColorBrandAuto;
  manual: ConfigurationStateColorBrandManual;
};
export type ConfigurationStateColorNeutral = ConfigurationStateColorsManual;

export type ConfigurationStateColor = {
  brand: ConfigurationStateColorBrand & {
    type: keyof ConfigurationStateColorBrand;
  };
  neutral: ConfigurationStateColorsManual;
};

function getMinMax<T extends number>(
  def: ZodUnionDef<[ZodLiteral<T>, ...ZodLiteral<T>[]]>
) {
  const optionalArr = def.options.map((option) => option._def.value);
  return {
    min: Math.min(...optionalArr),
    max: Math.max(...optionalArr),
  };
}

export const colorAutoPresets: {
  [key in ButteryTokensColorBrandTypeAuto["type"]]: {
    saturation: { min: number; max: number };
    brightness: { min: number; max: number };
  };
} = {
  earth: {
    saturation: getMinMax(ColorBrandTypeEarthSchema.shape.saturation._def),
    brightness: getMinMax(ColorBrandTypeEarthSchema.shape.brightness._def),
  },
  fluorescent: {
    saturation: getMinMax(
      ColorBrandTypeFluorescentSchema.shape.saturation._def
    ),
    brightness: getMinMax(
      ColorBrandTypeFluorescentSchema.shape.brightness._def
    ),
  },
  jewel: {
    saturation: getMinMax(ColorBrandTypeJewelSchema.shape.saturation._def),
    brightness: getMinMax(ColorBrandTypeJewelSchema.shape.brightness._def),
  },
  neutral: {
    saturation: getMinMax(ColorBrandTypeNeutralSchema.shape.saturation._def),
    brightness: getMinMax(ColorBrandTypeNeutralSchema.shape.brightness._def),
  },
  pastel: {
    saturation: getMinMax(ColorBrandTypePastelSchema.shape.saturation._def),
    brightness: getMinMax(ColorBrandTypePastelSchema.shape.brightness._def),
  },
};

export function getInitColorStateFromConfig(
  config: ButteryTokensConfig
): ConfigurationStateColor {
  const brandColors = Object.entries(config.color.brand.colors ?? {}).reduce(
    (accum, [colorName, colorDefValue]) =>
      Object.assign(accum, {
        [generateGUID()]: {
          name: colorName,
          ...colorDefValue,
        },
      }),
    {}
  );
  const neutralColors = Object.entries(config.color.neutral ?? {}).reduce(
    (accum, [colorName, colorDefValue]) => {
      const def =
        typeof colorDefValue === "string"
          ? { hex: colorDefValue }
          : colorDefValue;
      return Object.assign(accum, {
        [generateGUID()]: {
          name: colorName,
          ...def,
        },
      });
    },
    {}
  );
  // START HERE WITH THE NEUTRAL COLORS
  if (config.color.brand.type === "manual") {
    return {
      brand: {
        type: "manual",
        manual: {
          type: "manual",
          colors: brandColors,
        },
        auto: {
          type: "earth",
          brightness: 36,
          saturation: 36,
          colors: {},
        },
      },
      neutral: neutralColors,
    };
  }

  return {
    brand: {
      type: "auto",
      manual: {
        type: "manual",
        colors: {},
      },
      auto: {
        ...config.color.brand,
        colors: brandColors,
      },
    },
    neutral: neutralColors,
  };
}

export function transformColorStateIntoColorConfig(
  colorState: ConfigurationStateColor
): ButteryTokensConfig["color"] {
  const neutralColors = Object.values(colorState.neutral).reduce(
    (accum, { name, ...restDef }) => Object.assign(accum, { [name]: restDef }),
    {}
  );
  const brandColors = Object.values(
    colorState.brand[colorState.brand.type].colors
  ).reduce(
    (accum, { name, ...restDef }) => Object.assign(accum, { [name]: restDef }),
    {}
  );
  switch (colorState.brand.type) {
    case "manual":
      return {
        brand: {
          type: "manual",
          colors: brandColors,
        },
        neutral: neutralColors,
      };
    case "auto":
      return {
        brand: {
          ...colorState.brand.auto,
          colors: brandColors,
        },
        neutral: neutralColors,
      };

    default:
      exhaustiveMatchGuard(colorState.brand.type);
  }
}

// Start SIZE
export type ConfigurationStateSizeSpaceVariants = {
  [id: string]: {
    name: string;
    value: number;
  };
};
export type ConfigurationStateSizeAuto = Omit<SpaceAuto, "variants"> & {
  variants: ConfigurationStateSizeSpaceVariants;
};
export type ConfigurationStateSizeManual = Omit<SpaceManual, "variants"> & {
  variants: ConfigurationStateSizeSpaceVariants;
};
export type ConfigurationStateSize = Pick<
  ButteryTokensConfigSpaceAndSize,
  "documentFontSize" | "baselineGrid"
> & {
  mode: (ConfigurationStateSizeAuto | ConfigurationStateSizeManual)["mode"];
  manual: ConfigurationStateSizeManual;
  auto: ConfigurationStateSizeAuto;
};

function formatVariants(variants: Record<string, number>) {
  return Object.entries(variants).reduce(
    (accum, [variantName, variantValue]) =>
      Object.assign(accum, {
        [`__${generateGUID()}`]: {
          name: variantName,
          value: variantValue,
        },
      }),
    {}
  );
}

export function formatSpaceAutoVariants(
  variants: number | string[],
  baselineGrid: number,
  factor?: number
): ConfigurationStateSizeAuto["variants"] {
  const autoVariants = calculateSpaceVariantsAuto(
    variants,
    baselineGrid,
    factor
  );
  return formatVariants(autoVariants);
}

function formatManualVariants(
  variants: Record<string, number>
): ConfigurationStateSizeManual["variants"] {
  return formatVariants(variants);
}

export function getInitSizeFromConfig(
  config: ButteryTokensConfig
): ConfigurationStateSize {
  switch (config.size.space.mode) {
    case "auto": {
      return {
        documentFontSize: config.size.documentFontSize,
        baselineGrid: config.size.baselineGrid,
        mode: config.size.space.mode,
        auto: {
          mode: "auto",
          factor: config.size.space.factor,
          variants: formatSpaceAutoVariants(
            config.size.space.variants,
            config.size.baselineGrid,
            config.size.space.factor
          ),
        },
        manual: {
          mode: "manual",
          variants: formatManualVariants({ sm: 4, md: 8, lg: 12 }),
        },
      };
    }

    case "manual": {
      return {
        documentFontSize: config.size.documentFontSize,
        baselineGrid: config.size.baselineGrid,
        mode: config.size.space.mode,
        auto: {
          mode: "auto",
          variants: formatSpaceAutoVariants(11, config.size.baselineGrid),
        },
        manual: {
          mode: "manual",
          variants: formatManualVariants(config.size.space.variants),
        },
      };
    }

    default:
      return exhaustiveMatchGuard(config.size.space);
  }
}

export function transformSizeStateIntoColorConfig(
  state: ReturnType<typeof getInitSizeFromConfig>
) {
  return state;
}
