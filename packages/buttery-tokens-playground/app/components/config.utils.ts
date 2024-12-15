import type {
  ColorDefHueSchema,
  ButteryTokensConfig,
  ColorDefHexSchema,
  ButteryTokensColorBrandTypeAuto,
  ButteryTokensColorBrandTypeManual,
} from "@buttery/tokens-utils/schemas";
import { ConfigSchema } from "@buttery/tokens-utils/schemas";
import { generateGUID } from "@buttery/utils/isomorphic";
import type { z } from "zod";

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
