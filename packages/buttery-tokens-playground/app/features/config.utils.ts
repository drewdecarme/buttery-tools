import { exhaustiveMatchGuard } from "@buttery/components";
import type { SpaceVariantsRecord } from "@buttery/tokens-utils";
import {
  calculateSpaceVariantsAuto,
  calculateSpaceVariantsManual,
} from "@buttery/tokens-utils";
import type {
  ColorDefHueSchema,
  ButteryTokensConfig,
  ColorDefHexSchema,
  ButteryTokensColorBrandTypeAuto,
  ButteryTokensColorBrandTypeManual,
  SpaceAuto,
  SpaceManual,
  ButteryTokensConfigSizeAndSpace,
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
import { match } from "ts-pattern";
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

// Start Size And Space
export type ConfigurationStateSizeAndSpace_SpaceVariants = {
  [id: string]: {
    name: string;
    value: number;
    order: number;
  };
};
export type ConfigurationStateSizeAndSpace_SpaceAuto = Omit<
  SpaceAuto,
  "variants"
> & {
  variants: ConfigurationStateSizeAndSpace_SpaceVariants;
};
export type ConfigurationStateSizeAndSpace_SpaceManual = Omit<
  SpaceManual,
  "variants"
> & {
  variants: ConfigurationStateSizeAndSpace_SpaceVariants;
};
export type ConfigurationStateSizeAndSpace_SizeVariants = Record<
  string,
  { name: string; value: number }
>;
export type ConfigurationStateSizeAndSpace = Pick<
  ButteryTokensConfigSizeAndSpace,
  "baseFontSize" | "baselineGrid"
> & {
  size: {
    variants: ConfigurationStateSizeAndSpace_SizeVariants;
  };
  space: {
    mode: Required<ButteryTokensConfigSizeAndSpace>["space"]["mode"];
    manual: ConfigurationStateSizeAndSpace_SpaceManual;
    auto: ConfigurationStateSizeAndSpace_SpaceAuto;
  };
};

export function orderSpaceVariants(
  variants: ConfigurationStateSizeAndSpace_SpaceVariants
): ConfigurationStateSizeAndSpace_SpaceVariants {
  return Object.fromEntries(
    Object.entries(variants).sort((a, b) => a[1].order - b[1].order)
  );
}

function convertSpaceVariantConfigIntoState(
  variants: SpaceVariantsRecord
): ConfigurationStateSizeAndSpace_SpaceVariants {
  const spaceVariants = Object.entries(variants).reduce(
    (accum, [variantName, variantValue], i) =>
      Object.assign(accum, {
        [generateGUID()]: {
          name: variantName,
          value: variantValue,
          order: i,
        },
      }),
    {}
  );
  const orderedVariants = orderSpaceVariants(spaceVariants);
  return orderedVariants;
}

function createSpaceAutoVariantsFromConfig(
  variants: number | string[],
  baselineGrid: number,
  factor?: number
): ConfigurationStateSizeAndSpace_SpaceAuto["variants"] {
  const autoVariants = calculateSpaceVariantsAuto(
    variants,
    baselineGrid,
    factor
  );
  return convertSpaceVariantConfigIntoState(autoVariants);
}

function createSpaceManualVariantsFromConfig(
  variants: Record<string, number>
): ConfigurationStateSizeAndSpace_SpaceManual["variants"] {
  const manualVariants = calculateSpaceVariantsManual(variants);
  return convertSpaceVariantConfigIntoState(manualVariants);
}

function createSizeVariantsFromConfig(
  variants: ButteryTokensConfig["sizeAndSpace"]["size"]["variants"]
): ConfigurationStateSizeAndSpace_SizeVariants {
  return Object.fromEntries(
    Object.entries(variants).map(([variantName, variantValue]) => [
      generateGUID(),
      { name: variantName, value: variantValue },
    ])
  );
}

export function getInitStateSizeAndSpaceFromConfig(
  config: ButteryTokensConfig
): ConfigurationStateSizeAndSpace {
  switch (config.sizeAndSpace.space.mode) {
    case "auto": {
      return {
        baseFontSize: config.sizeAndSpace.baseFontSize,
        baselineGrid: config.sizeAndSpace.baselineGrid,
        size: {
          variants: createSizeVariantsFromConfig(
            config.sizeAndSpace.size.variants
          ),
        },
        space: {
          mode: config.sizeAndSpace.space.mode,
          auto: {
            mode: "auto",
            factor: config.sizeAndSpace.space.factor,
            variants: createSpaceAutoVariantsFromConfig(
              config.sizeAndSpace.space.variants,
              config.sizeAndSpace.baselineGrid,
              config.sizeAndSpace.space.factor
            ),
          },
          manual: {
            mode: "manual",
            variants: createSpaceManualVariantsFromConfig({
              sm: 4,
              md: 8,
              lg: 12,
            }),
          },
        },
      };
    }

    case "manual": {
      return {
        baseFontSize: config.sizeAndSpace.baseFontSize,
        baselineGrid: config.sizeAndSpace.baselineGrid,
        size: {
          variants: createSizeVariantsFromConfig(
            config.sizeAndSpace.size.variants
          ),
        },
        space: {
          mode: config.sizeAndSpace.space.mode,
          auto: {
            mode: "auto",
            variants: createSpaceAutoVariantsFromConfig(
              11,
              config.sizeAndSpace.baselineGrid
            ),
          },
          manual: {
            mode: "manual",
            variants: createSpaceManualVariantsFromConfig(
              config.sizeAndSpace.space.variants
            ),
          },
        },
      };
    }

    default:
      return exhaustiveMatchGuard(config.sizeAndSpace.space);
  }
}

export function transformSizeAndSpaceStateIntoColorConfig(
  state: ConfigurationStateSizeAndSpace
): ButteryTokensConfig["sizeAndSpace"] {
  const space = match<
    ConfigurationStateSizeAndSpace["space"],
    ButteryTokensConfig["sizeAndSpace"]["space"]
  >(state.space)
    .with({ mode: "auto" }, (state) => ({
      mode: "auto",
      factor: state.auto.factor,
      variants: Object.values(state.auto.variants).map(({ name }) => name),
    }))
    .with({ mode: "manual" }, (state) => ({
      mode: "manual",
      variants: Object.values(state.manual.variants).reduce(
        (accum, { name, value }) => Object.assign(accum, { [name]: value }),
        {}
      ),
    }))
    .exhaustive();

  const size = {
    variants: Object.values(state.size.variants).reduce<
      ButteryTokensConfig["sizeAndSpace"]["size"]["variants"]
    >((accum, { name, value }) => Object.assign(accum, { [name]: value }), {}),
  };

  return {
    baseFontSize: state.baseFontSize,
    baselineGrid: state.baselineGrid,
    size,
    space,
  };
}
