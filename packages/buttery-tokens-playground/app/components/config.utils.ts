import type {
  ColorDefHueSchema,
  ButteryTokensConfig,
  ColorDefHexSchema,
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
type ConfigurationStateColorBrand = {
  auto: ConfigurationStateColorBrandColorsAuto;
  manual: ConfigurationStateColorBrandColorsManual;
};
export type ConfigurationStateColor = {
  brand: ConfigurationStateColorBrand & {
    type: keyof ConfigurationStateColorBrand;
  };
};

export function getInitColorStateFromConfig(
  config: ButteryTokensConfig
): ConfigurationStateColor {
  const colors = Object.entries(config.color.brand.colors).reduce(
    (accum, [colorName, colorDefValue]) =>
      Object.assign(accum, {
        [generateGUID()]: {
          name: colorName,
          ...colorDefValue,
        },
      }),
    {}
  );
  return {
    brand: {
      type: config.color.brand.type === "manual" ? "manual" : "auto",
      manual: config.color.brand.type === "manual" ? colors : {},
      auto: config.color.brand.type !== "manual" ? colors : {},
    },
  };
}
