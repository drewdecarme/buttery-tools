import {
  type FontVariant,
  type ManualFontStyles,
  type FontFamiliesManual,
  type ButteryTokensConfig,
  fontFamilyFallback,
  manualFontStyles,
} from "@buttery/tokens-utils/schemas";
import { exhaustiveMatchGuard, generateGUID } from "@buttery/utils/isomorphic";
import type { Updater } from "use-immer";
import { useImmer } from "use-immer";

export type ConfigurationStateFontFamilyWeights = Record<
  string,
  { name: string; value: number }
>;

export type ConfigurationStateFontVariantValue = {
  variantName: string;
  familyToken: string;
  weight: string;
  size: number;
  lineHeight: number;
};
export type ConfigurationStateFontVariant = Record<
  string,
  ConfigurationStateFontVariantValue
>;

export type ConfigurationStateFontFamilyValuesMeta = {
  meta: {
    isOpen: boolean;
  };
};

export type ConfigurationStateFontManualFamilyValues =
  ConfigurationStateFontFamilyValuesMeta & {
    tokenName: string;
    familyName: string;
    fallback?: string;
    styles: {
      [key: string]: { display: string };
    };
  };
export type ConfigurationStateFontManualFamily = Record<
  string,
  ConfigurationStateFontManualFamilyValues
>;
export type ConfigurationStateFontManual = {
  source: "manual";
  families: ConfigurationStateFontManualFamily;
};

export type ConfigurationStateFontRegistryFamilyValues =
  ConfigurationStateFontFamilyValuesMeta & {
    tokenName: string;
    familyName: string;
    fallback?: string;
    styles: string[];
  };
export type ConfigurationStateFontRegistryFamily = Record<
  string,
  ConfigurationStateFontRegistryFamilyValues
>;
export type ConfigurationStateFontGoogle = {
  source: "google";
  families: ConfigurationStateFontRegistryFamily;
};
export type ConfigurationStateFontAdobe = {
  source: "adobe";
  families: ConfigurationStateFontRegistryFamily;
};

type ConfigurationStateFontShared = {
  variants: ConfigurationStateFontVariant;
};
export type ConfigurationStateFont = ConfigurationStateFontShared &
  (
    | ConfigurationStateFontManual
    | ConfigurationStateFontGoogle
    | ConfigurationStateFontAdobe
  );

export function getInitStateFontFromConfig(
  config: ButteryTokensConfig
): ConfigurationStateFont {
  const variants = Object.entries(
    config.font.variants
  ).reduce<ConfigurationStateFontVariant>(
    (accum, [variantName, variant]) =>
      Object.assign<
        ConfigurationStateFontVariant,
        ConfigurationStateFontVariant
      >(accum, {
        [generateGUID()]: {
          variantName,
          ...variant,
        },
      }),
    {}
  );

  switch (config.font.source) {
    case "manual":
      return {
        source: "manual",
        variants,
        families: Object.entries(
          config.font.families
        ).reduce<ConfigurationStateFontManualFamily>(
          (accum, [tokenName, familyDef]) =>
            Object.assign<
              ConfigurationStateFontManualFamily,
              ConfigurationStateFontManualFamily
            >(accum, {
              [generateGUID()]: {
                tokenName,
                familyName: familyDef.family,
                fallback: familyDef.fallback,
                styles:
                  familyDef.styles.length > 0
                    ? familyDef.styles.reduce(
                        (accum, style) =>
                          Object.assign(accum, {
                            [style]: {
                              display: manualFontStyles[style],
                            },
                          }),
                        {}
                      )
                    : {
                        "regular-400": {
                          display: manualFontStyles["regular-400"],
                        },
                      },
                meta: {
                  isOpen: false,
                },
              },
            }),
          {}
        ),
      };

    case "adobe":
    case "google":
      return {
        source: config.font.source,
        variants,
        families: Object.entries(
          config.font.families
        ).reduce<ConfigurationStateFontRegistryFamily>(
          (accum, [familyName, familyDef]) =>
            Object.assign<
              ConfigurationStateFontRegistryFamily,
              ConfigurationStateFontRegistryFamily
            >(accum, {
              [generateGUID()]: {
                name: familyName,
                ...familyDef,
              },
            }),
          {}
        ),
      };

    default:
      return exhaustiveMatchGuard(config.font);
  }
}

export function getFontConfigFromState(
  state: ConfigurationStateFont
): ButteryTokensConfig["font"] {
  const families =
    state.source === "manual"
      ? Object.values(state.families).reduce(
          (accum, family) =>
            Object.assign<FontFamiliesManual, FontFamiliesManual>(accum, {
              [family.tokenName]: {
                family: family.familyName,
                fallback: family.fallback ?? fontFamilyFallback,
                styles: Object.keys(family.styles) as ManualFontStyles,
              },
            }),
          {}
        )
      : Object.values(state.families).reduce(
          (accum, family) =>
            Object.assign(accum, {
              [family.tokenName]: {
                family: family.familyName,
                fallback: family.fallback ?? fontFamilyFallback,
                styles: Object.keys(family.styles),
              },
            }),
          {}
        );

  return {
    source: state.source,
    families,
    variants: Object.values(state.variants).reduce(
      (accum, variant) =>
        Object.assign<typeof state.variants, FontVariant>(accum, {
          [variant.variantName]: {
            familyToken: variant.familyToken,
            lineHeight: variant.lineHeight,
            size: variant.size,
            weight: variant.weight,
          },
        }),
      {}
    ),
  };
}

export function useConfigStateFont(initConfig: ButteryTokensConfig) {
  return useImmer(getInitStateFontFromConfig(initConfig));
}
export type ConfigurationContextFontType = {
  font: ConfigurationStateFont;
  setFont: Updater<ConfigurationStateFont>;
};

export type OnFontFamilyAction = (
  options:
    | { action: "addFontFamily" }
    | { action: "deleteFontFamily"; id: string }
    | { action: "toggle"; id: string }
    | { action: "addStyle"; id: string; style: string }
    | { action: "deleteStyle"; id: string; style: string }
    | { action: "changeSource"; source: ConfigurationStateFont["source"] }
    | {
        action: "changeTokenName";
        id: string;
        token: string;
      }
    | {
        action: "changeFamilyName";
        id: string;
        fontFamilyName: string;
      }
    | {
        action: "changeFallback";
        id: string;
        fallback: string | undefined;
      }
) => void;

export type OnFontVariantAction = (
  options:
    | { action: "addVariant" }
    | { action: "deleteVariant"; id: string }
    | { action: "changeVariantName"; id: string; name: string }
    | { action: "changeVariantFamilyToken"; id: string; familyToken: string }
    | { action: "changeVariantSize"; id: string; size: number }
    | {
        action: "changeVariantWeightAndStyle";
        id: string;
        weightAndStyle: string;
      }
) => void;
