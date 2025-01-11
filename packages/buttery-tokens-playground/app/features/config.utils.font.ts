import {
  type ManualFontStyles,
  type ButteryTokensConfig,
  manualFontStyles,
} from "@buttery/tokens-utils/schemas";
import { exhaustiveMatchGuard, generateGUID } from "@buttery/utils/isomorphic";

export type ConfigurationStateFontFamilyWeights = Record<
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

export type ConfigurationStateFontFamilyValuesMeta = {
  meta: {
    isOpen: boolean;
  };
};

export type ConfigurationStateFontManualFamilyValues =
  ConfigurationStateFontFamilyValuesMeta & {
    name: string;
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
    name: string;
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
  variants: ConfigurationStateFontVariants;
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

  switch (config.font.source) {
    case "manual":
      return {
        source: "manual",
        variants,
        families: Object.entries(
          config.font.families
        ).reduce<ConfigurationStateFontManualFamily>(
          (accum, [familyName, familyDef]) =>
            Object.assign<
              ConfigurationStateFontManualFamily,
              ConfigurationStateFontManualFamily
            >(accum, {
              [generateGUID()]: {
                name: familyName,
                fallback: familyDef.fallback,
                styles: {
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

export function transformFontStateStateIntoFontConfig(
  state: ConfigurationStateFont
): ButteryTokensConfig["font"] {
  // const families = Object.values(state.families).reduce(
  //   (accum, family) =>
  //     Object.assign(accum, {
  //       [family.name]: family.fallback
  //         ? { fontFamily: family.fontFamily, fallback: family.fallback }
  //         : family.fontFamily,
  //     }),
  //   {}
  // );
  // return {
  //   families,
  // };
}

export type OnFontVariantAction = (
  options:
    | { action: "addFontFamily" }
    | { action: "toggle"; id: string }
    | { action: "addStyle"; id: string; style: string }
    | { action: "deleteStyle"; id: string; style: string }
    | { action: "changeSource"; source: ConfigurationStateFont["source"] }
    | {
        action: "changeFontFamily";
        id: string;
        fontFamily: string;
      }
    | {
        action: "changeFallback";
        id: string;
        fallback: string | undefined;
      }
) => void;
