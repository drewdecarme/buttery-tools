import {
  fontFamilyFallback,
  type ButteryTokensConfig,
} from "@buttery/tokens-utils/schemas";
import { generateGUID } from "@buttery/utils/isomorphic";

export type ConfigurationStateFontFamilies = Record<
  string,
  { name: string; fontFamily: string; fallback?: string }
>;
export type ConfigurationStateFontWeights = Record<
  string,
  { name: string; value: number }
>;
export type ConfigurationStateFontVariants = Record<
  string,
  {
    variantName: string;
    family: string;
    weight: string;
    size: number;
    lineHeight: number;
  }
>;
export type ConfigurationStateFont = {
  families: ConfigurationStateFontFamilies;
  weights: ConfigurationStateFontWeights;
  variants: ConfigurationStateFontVariants;
};

export function getInitStateFontFromConfig(
  config: ButteryTokensConfig
): ConfigurationStateFont {
  const configFamilies = config.font.families ?? {};
  const families = Object.entries(
    configFamilies
  ).reduce<ConfigurationStateFontFamilies>(
    (accum, [name, family]) =>
      Object.assign<
        ConfigurationStateFontFamilies,
        ConfigurationStateFontFamilies
      >(accum, {
        [generateGUID()]: {
          name,
          fontFamily: typeof family === "string" ? family : family.fontFamily,
          fallback:
            typeof family === "string" ? fontFamilyFallback : family.fallback,
        },
      }),
    {}
  );

  const configWeights = config.font.weights ?? {};
  const weights = Object.entries(
    configWeights
  ).reduce<ConfigurationStateFontWeights>(
    (accum, [name, value]) =>
      Object.assign<
        ConfigurationStateFontWeights,
        ConfigurationStateFontWeights
      >(accum, {
        [generateGUID()]: {
          name,
          value,
        },
      }),
    {}
  );

  const configVariants = config.font.variants ?? {};
  const variants = Object.entries(
    configVariants
  ).reduce<ConfigurationStateFontVariants>(
    (accum, [variantName, variant]) =>
      Object.assign<
        ConfigurationStateFontVariants,
        ConfigurationStateFontVariants
      >(accum, {
        [generateGUID()]: {
          variantName,
          ...variant,
        },
      }),
    {}
  );
  return {
    families,
    weights,
    variants,
  };
}
