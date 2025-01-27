import { exhaustiveMatchGuard } from "@buttery/components";
import type {
  ButteryTokensConfig,
  ColorDefHueSchema,
  ColorDefHexSchema,
  ButteryTokensColorBrandTypeAuto,
  ButteryTokensColorBrandTypeManual,
} from "@buttery/tokens-utils/schemas";
import {
  ConfigSchema,
  ColorBrandTypeEarthSchema,
  ColorBrandTypeFluorescentSchema,
  ColorBrandTypeJewelSchema,
  ColorBrandTypeNeutralSchema,
  ColorBrandTypePastelSchema,
} from "@buttery/tokens-utils/schemas";
import { generateGUID } from "@buttery/utils/isomorphic";
import type { Updater } from "use-immer";
import { useImmer } from "use-immer";
import type { z, ZodUnionDef, ZodLiteral } from "zod";
import { match } from "ts-pattern";
import {
  createBrandVariants,
  createNeutralVariants,
} from "@buttery/tokens-utils";

import type { ColorPreviewThemeMode } from "./color/ColorPreview.context";

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

export function getColorConfigFromState(
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

export function useConfigStateColor(initConfig: ButteryTokensConfig) {
  return useImmer(getInitColorStateFromConfig(initConfig));
}
export type ConfigurationContextColorType = {
  color: ConfigurationStateColor;
  setColor: Updater<ConfigurationStateColor>;
};

export const colorThemeMap: Record<ColorPreviewThemeMode, string> = {
  dark: "#1e1e1e",
  light: "#ffffff",
};

export const convertBrandColorIntoVariants = (
  color: ConfigurationStateColor
) => {
  return match(color.brand)
    .with({ type: "auto" }, (state) => {
      const variants = createBrandVariants({
        ...state.auto,
        colors: Object.values(state.auto.colors).reduce(
          (accum, { name, ...restDef }) =>
            Object.assign(accum, { [name]: restDef }),
          {}
        ),
      });
      return variants;
    })
    .with({ type: "manual" }, (state) => {
      const variants = createBrandVariants({
        type: "manual",
        colors: Object.values(state.manual.colors).reduce(
          (accum, { name, ...restDef }) =>
            Object.assign(accum, { [name]: restDef }),
          {}
        ),
      });
      return variants;
    })
    .exhaustive();
};

export function convertNeutralColorIntoVariants(
  color: ConfigurationStateColor
) {
  return createNeutralVariants(
    Object.values(color.neutral).reduce(
      (accum, { name, ...restDef }) =>
        Object.assign(accum, { [name]: restDef }),
      {}
    )
  );
}
