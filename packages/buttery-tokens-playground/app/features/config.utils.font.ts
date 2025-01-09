import { type ButteryTokensConfig } from "@buttery/tokens-utils/schemas";
import { generateGUID } from "@buttery/utils/isomorphic";

export type ConfigurationStateFontFamilyWeights = Record<
  string,
  { name: string; value: number }
>;

export type ConfigurationStateFontFamilies = Record<
  string,
  {
    name: string;
    fontFamily: string;
    fallback?: string;
    weights: ConfigurationStateFontFamilyWeights;
  }
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
  variants: ConfigurationStateFontVariants;
};

export function getInitStateFontFromConfig(
  config: ButteryTokensConfig
): ConfigurationStateFont {
  const configFamilies = config.font.families ?? {};
  const families = Object.entries(
    configFamilies
  ).reduce<ConfigurationStateFontFamilies>(
    (accum, [name, { weights, ...restFamily }]) =>
      Object.assign<
        ConfigurationStateFontFamilies,
        ConfigurationStateFontFamilies
      >(accum, {
        [generateGUID()]: {
          name,
          ...restFamily,
          weights: Object.entries(
            weights
          ).reduce<ConfigurationStateFontFamilyWeights>(
            (accum, [weightName, weightValue]) =>
              Object.assign(accum, {
                [generateGUID()]: {
                  name: weightName,
                  value: weightValue,
                },
              }),
            {}
          ),
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
    variants,
  };
}

export function transformFontStateStateIntoFontConfig(
  state: ConfigurationStateFont
): ButteryTokensConfig["font"] {
  const families = Object.values(state.families).reduce(
    (accum, family) =>
      Object.assign(accum, {
        [family.name]: family.fallback
          ? { fontFamily: family.fontFamily, fallback: family.fallback }
          : family.fontFamily,
      }),
    {}
  );

  return {
    families,
  };
}
