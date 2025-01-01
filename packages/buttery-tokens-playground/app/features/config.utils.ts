import { exhaustiveMatchGuard } from "@buttery/components";
import type {
  ColorDefHueSchema,
  ButteryTokensConfig,
  ColorDefHexSchema,
  ButteryTokensColorBrandTypeAuto,
  ButteryTokensColorBrandTypeManual,
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
  const colors = Object.entries(config.color.brand.colors ?? {}).reduce(
    (accum, [colorName, colorDefValue]) =>
      Object.assign(accum, {
        [generateGUID()]: {
          name: colorName,
          ...colorDefValue,
        },
      }),
    {}
  );
  if (config.color.brand.type === "manual") {
    return {
      brand: {
        type: "manual",
        manual: {
          type: "manual",
          colors,
        },
        auto: {
          type: "earth",
          brightness: 36,
          saturation: 36,
          colors: {},
        },
      },
      neutral: {
        neutral: {
          hex: "#4A4A4A",
          name: "neutral",
          variants: 10,
        },
        surface: {
          hex: "#FAFAFA",
          name: "surface",
          variants: 2,
        },
        background: {
          hex: "#F5F5F5",
          name: "background",
          variants: 2,
        },
      },
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
        colors,
      },
    },
    neutral: {
      neutral: {
        hex: "#4A4A4A",
        name: "neutral",
        variants: 10,
      },
      surface: {
        hex: "#FAFAFA",
        name: "surface",
        variants: 1,
      },
      background: {
        hex: "#F5F5F5",
        name: "background",
        variants: 1,
      },
    },
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
