import { exhaustiveMatchGuard } from "@buttery/utils/isomorphic";
import chroma from "chroma-js";

import { type CompileFunction, MakeTemplate } from "./MakeTemplate.js";

import type {
  ButteryTokensColorVariant,
  ButteryTokensConfigColor,
  ButteryTokensConfigColorBrand,
  ButteryTokensConfigColorDefHex,
  ButteryTokensConfigColorDefHue,
  ButteryTokensConfigColorNeutral,
} from "../../config/schema.color.js";
import {
  hexToHsl,
  hexToRgb,
  hsbToHex,
} from "../../utils/util.color-conversions.js";
import { LOG } from "../../utils/util.logger.js";

type HEXValue = string;
type VariantMap = {
  base: string;
  [variantName: string]: HEXValue;
};
type VariantManifest = {
  [colorName: string]: VariantMap;
};

function autoCreateVariantMap(variants: string[]): Omit<VariantMap, "base"> {
  return variants.reduce<Omit<VariantMap, "base">>((accum, variant, i) => {
    const variantName = i === 0 ? "50" : (i * 100).toString();
    return Object.assign(accum, {
      [variantName]: variant,
    });
  }, {});
}

function createVariantsFromBaseHex(
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

function createVariantsFromDefHue(
  colorDef: ButteryTokensConfigColorDefHue,
  saturation: number,
  brightness: number
): VariantMap {
  const [_, colorValue] = Object.entries(colorDef)[0];
  // hue to hex
  const baseHex = hsbToHex(colorValue.hue, saturation, brightness);
  return createVariantsFromBaseHex(baseHex, colorValue.variants);
}

function createVariantsFromDefHex(
  colorDef: ButteryTokensConfigColorDefHex
): VariantMap {
  const [_, colorValue] = Object.entries(colorDef)[0];
  return createVariantsFromBaseHex(colorValue.hex, colorValue.variants);
}

/**
 * Loops through all of the brand colors and creates their variants
 * based upon the type of the brand config.
 */
function createBrandVariants(
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
function createNeutralVariants(
  neutralConfig: ButteryTokensConfigColorNeutral | undefined
): VariantManifest {
  if (!neutralConfig) return {};
  return Object.entries(neutralConfig).reduce<VariantManifest>(
    (accum, [colorName, colorValue]) => {
      console.log(colorName, colorValue);
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

function createColorManifest(
  colorConfig: ButteryTokensConfigColor | undefined
) {
  const colorVariantsBrand = createBrandVariants(colorConfig?.brand);
  const colorVariantsNeutral = createNeutralVariants(colorConfig?.neutral);

  const variantManifest = { ...colorVariantsBrand, ...colorVariantsNeutral };
  return variantManifest;
}

function flattenVariantManifest(
  manifest: VariantManifest
): Record<string, string> {
  const flatManifest: Record<string, string> = {};

  for (const color in manifest) {
    const variants = manifest[color];
    if (typeof variants !== "object") {
      flatManifest[color] = variants;
      continue;
    }

    for (const variant in variants) {
      flatManifest[`${color}-${variant}`] = variants[variant];
    }
  }

  return flatManifest;
}

const template: CompileFunction = ({
  config,
  methods,
  docs,
  functionName,
  cssVarPrefix,
}) => {
  const brandColorNames = Object.keys(config.color?.brand?.colors ?? {});
  const neutralColorNames = Object.keys(config.color?.neutral ?? {});
  const colorNames = [...brandColorNames, ...neutralColorNames];
  const colorUnion = methods.createTypeUnion(colorNames);

  const colorManifest = createColorManifest(config.color);

  return `export type Color = ${colorUnion};
export const colorVariantMap = ${JSON.stringify(colorManifest, null, 2)};
type ColorVariantMap = typeof colorVariantMap;
type ColorVariants<T extends keyof ColorVariantMap> = keyof ColorVariantMap[T];
type ColorOptions = { opacity?: number };

/**
 * ## Description
 * ${docs.description}
 *
 * ## Usage
 * ### css-in-ts
 * \`\`\`ts
 * import { css } from "@linaria/core";
 * ${docs.importClause}
 * 
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ color: ${functionName}("${colorNames[0]}") }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * 
 * \`
 * \`\`\`
 */
export function ${functionName}<T extends keyof ColorVariantMap, V extends ColorVariants<T>>(tokenName: T, variant: V, options?: ColorOptions): string;
export function ${functionName}<T extends keyof ColorVariantMap>(tokenName: T, options?: ColorOptions): string;
export function makeColor<T extends keyof ColorVariantMap, V extends ColorVariants<T>>(tokenName: T, variantOrOptions?: V | ColorOptions, options?: ColorOptions): string {
  if (typeof variantOrOptions === "undefined") {
    return \`rgb(var(${cssVarPrefix}-\${tokenName}-rgb)\`;
  }

  // no variant
  if (typeof variantOrOptions === "object") {
    const opacity = variantOrOptions?.opacity ?? 1;
    return \`rgba(var(${cssVarPrefix}-\${tokenName}-rgb), \${opacity})\`;
  }

  // variant has been defined
  const variant = variantOrOptions.toString();
  const opacity = options?.opacity ?? 1;
  return \`rgba(var(${cssVarPrefix}-\${tokenName}-\${variant}-rgb), \${opacity})\`;
}
`;
};

const css: CompileFunction = ({ config, cssVarPrefix }) => {
  const colorManifest = createColorManifest(config.color);
  const flatManifest = flattenVariantManifest(colorManifest);

  const variants = Object.entries(flatManifest).reduce<string[]>(
    (accum, [variantId, variantVal]) => {
      const [name, colorVariantId] = variantId.split("-");
      const variantName = colorVariantId === "base" ? name : variantId;

      // construct the variant variables
      const variantPrefix = `${cssVarPrefix}-${variantName}`;
      const hex = variantVal;
      const { h, s, l } = hexToHsl(variantVal);
      const { r, g, b } = hexToRgb(variantVal);
      const variant = `${variantPrefix}: ${hex}`;
      const variantHex = `${variantPrefix}-hex: ${hex}`;
      const variantHsl = `${variantPrefix}-hsl: ${h}, ${s}, ${l}`;
      const variantRgb = `${variantPrefix}-rgb: ${r}, ${g}, ${b}`;

      return [...accum, variant, variantHex, variantHsl, variantRgb];
    },
    []
  );

  const variantString = variants.join(`;\n`);
  LOG.debug("Variants:");
  LOG.debug(variantString);

  return variantString;
};

export const MakeTemplateColor = new MakeTemplate({
  functionName: "makeColor",
  functionDescription:
    "A utility that allows you to safely incorporate brand color into your apps by easily adding the design token along with optional adjustments & variants.",
  variableBody: "color",
  template,
  css,
});
