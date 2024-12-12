import chroma from "chroma-js";
import { exhaustiveMatchGuard } from "@buttery/utils/isomorphic";

import { hsbToHex } from "./util.color-conversions.js";

import type {
  ButteryTokensColorVariant,
  ButteryTokensConfigColorDefHue,
  ButteryTokensConfigColorDefHex,
  ButteryTokensConfigColorBrand,
  ButteryTokensConfigColorNeutral,
} from "../schemas/schema.color.js";

type HEXValue = string;
export type VariantMap = {
  base: string;
  [variantName: string]: HEXValue;
};
export type VariantManifest = {
  [colorName: string]: VariantMap;
};

export function autoCreateVariantMap(
  variants: string[]
): Omit<VariantMap, "base"> {
  return variants.reduce<Omit<VariantMap, "base">>((accum, variant, i) => {
    const variantName = i === 0 ? "50" : (i * 100).toString();
    return Object.assign(accum, {
      [variantName]: variant,
    });
  }, {});
}

export function createVariantsFromBaseHex(
  baseHex: string,
  variantDef: ButteryTokensColorVariant
): VariantMap {
  const lightest = chroma(baseHex).brighten(2);
  const darkest = chroma(baseHex).darken(2);
  const scale = chroma.scale([lightest, baseHex, darkest]).mode("lab");

  // create a number of auto variants
  if (typeof variantDef === "number") {
    const numOfVariants = variantDef;
    const variants = scale.colors(numOfVariants);
    const variantMap = autoCreateVariantMap(variants);
    return {
      base: baseHex,
      ...variantMap,
    };
  }
  // create a set number of auto variants with the hex values in the array
  if (Array.isArray(variantDef)) {
    const numOfVariants = variantDef.length;
    const variants = scale.colors(numOfVariants);
    const variantMap = autoCreateVariantMap(variants);
    return {
      base: baseHex,
      ...variantMap,
    };
  }

  // the object is already in the format we want so
  // we just return it
  return {
    base: baseHex,
    ...variantDef,
  };
}

export function createVariantsFromDefHue(
  colorDef: ButteryTokensConfigColorDefHue,
  saturation: number,
  brightness: number
): VariantMap {
  const [_, colorValue] = Object.entries(colorDef)[0];
  // hue to hex
  const baseHex = hsbToHex(colorValue.hue, saturation, brightness);
  return createVariantsFromBaseHex(baseHex, colorValue.variants);
}

export function createVariantsFromDefHex(
  colorDef: ButteryTokensConfigColorDefHex
): VariantMap {
  const [_, colorValue] = Object.entries(colorDef)[0];
  return createVariantsFromBaseHex(colorValue.hex, colorValue.variants);
}

/**
 * Loops through all of the brand colors and creates their variants
 * based upon the type of the brand config.
 */
export function createBrandVariants(
  brandConfig: ButteryTokensConfigColorBrand | undefined
): VariantManifest {
  if (!brandConfig?.colors) return {};

  return Object.entries(brandConfig.colors).reduce<VariantManifest>(
    (accum, [colorName, colorValue]) => {
      const colorDef = { [colorName]: colorValue }; // reconstruct the definition
      switch (brandConfig.type) {
        case "manual":
          return Object.assign(accum, {
            [colorName]: createVariantsFromDefHex(colorDef),
          });

        case "earth":
        case "fluorescent":
        case "jewel":
        case "neutral":
        case "pastel":
          return Object.assign(accum, {
            [colorName]: createVariantsFromDefHue(
              colorDef,
              brandConfig.saturation,
              brandConfig.brightness
            ),
          });

        default:
          return exhaustiveMatchGuard(brandConfig);
      }
    },
    {}
  );
}

/**
 * Loops through all of the colors defined in the neutral config
 * and creates their variants
 */
export function createNeutralVariants(
  neutralConfig: ButteryTokensConfigColorNeutral | undefined
): VariantManifest {
  if (!neutralConfig) return {};
  return Object.entries(neutralConfig).reduce<VariantManifest>(
    (accum, [colorName, colorValue]) => {
      return Object.assign(accum, {
        [colorName]:
          typeof colorValue === "string"
            ? colorValue
            : createVariantsFromDefHex({ [colorName]: colorValue }),
      });
    },
    {}
  );
}
