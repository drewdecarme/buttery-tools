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
import { createHighlighter } from "shiki";
import type { z, ZodLiteral, ZodUnionDef } from "zod";

export const initConfig: ButteryTokensConfig = ConfigSchema.parse({});

export type ConfigurationStateColorBrandColorsAuto = {
  [id: string]: z.infer<typeof ColorDefHueSchema.valueSchema> & {
    name: string;
  };
};
export type ConfigurationStateColorBrandColorsManual = {
  [id: string]: z.infer<typeof ColorDefHexSchema.valueSchema> & {
    name: string;
  };
};
export type ConfigurationStateColorBrandAuto =
  ButteryTokensColorBrandTypeAuto & {
    colors: ConfigurationStateColorBrandColorsAuto;
  };
export type ConfigurationStateColorBrandManual =
  ButteryTokensColorBrandTypeManual & {
    colors: ConfigurationStateColorBrandColorsManual;
  };
export type ConfigurationStateColorBrand = {
  auto: ConfigurationStateColorBrandAuto;
  manual: ConfigurationStateColorBrandManual;
};
export type ConfigurationStateColor = {
  brand: ConfigurationStateColorBrand & {
    type: keyof ConfigurationStateColorBrand;
  };
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
  };
}

export function transformColorStateIntoColorConfig(
  colorState: ConfigurationStateColor
): ButteryTokensConfig["color"] {
  switch (colorState.brand.type) {
    case "manual":
      return {
        brand: {
          type: "manual",
          colors: Object.values(colorState.brand.manual.colors).reduce(
            (accum, { name, ...restDef }) =>
              Object.assign(accum, { [name]: restDef }),
            {}
          ),
        },
        neutral: {},
      };
    case "auto":
      return {
        brand: {
          ...colorState.brand.auto,
          colors: Object.values(colorState.brand.auto.colors).reduce(
            (accum, { name, ...restDef }) =>
              Object.assign(accum, { [name]: restDef }),
            {}
          ),
        },
        neutral: {},
      };

    default:
      exhaustiveMatchGuard(colorState.brand.type);
  }
}

export const highlighter = await createHighlighter({
  themes: ["dark-plus"],
  langs: ["typescript", "json"],
});
