import { exhaustiveMatchGuard } from "@buttery/utils/isomorphic";
import chroma from "chroma-js";

import { type CompileFunction, MakeTemplate } from "./MakeTemplate.js";

import type {
  ButteryTokensColorVariant,
  ButteryTokensConfigColorBrand,
  ButteryTokensConfigColorDefHex,
  ButteryTokensConfigColorDefHue,
  ButteryTokensConfigColorNeutral,
} from "../../config/schema.color.js";
import { hsbToHex } from "../../utils/util.color-conversions.js";

type HEXValue = string;
type VariantMap = {
  [variantName: string]: HEXValue;
};
type VariantManifest = {
  [colorName: string]: VariantMap;
};

function autoCreateVariantMap(variants: string[]): VariantMap {
  return variants.reduce<VariantMap>((accum, variant, i) => {
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
    return variantMap;
  }
  // create a set number of auto variants with the hex values in the array
  if (Array.isArray(variantDef)) {
    const numOfVariants = variantDef.length;
    const variants = scale.colors(numOfVariants);
    const variantMap = autoCreateVariantMap(variants);
    return variantMap;
  }

  // the object is already in the format we want so
  // we just return it
  return variantDef;
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
      if (typeof colorValue === "string") return accum;
      return Object.assign(accum, {
        [colorName]: createVariantsFromDefHex({ [colorName]: colorValue }),
      });
    },
    {}
  );
}

function flattenVariantManifest(
  manifest: VariantManifest
): Record<string, string> {
  const flatManifest: Record<string, string> = {};

  for (const color in manifest) {
    const variants = manifest[color];
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
  const colorNames = brandColorNames.concat(neutralColorNames);
  const colorUnion = methods.createTypeUnion(colorNames);
  console.log({ colorUnion });

  const colorVariantsBrand = createBrandVariants(config.color?.brand);
  const colorVariantsNeutral = createNeutralVariants(config.color?.neutral);

  const variantManifest = { ...colorVariantsBrand, ...colorVariantsNeutral };

  console.log("variantManifest");
  console.log(JSON.stringify(variantManifest, null, 2));
  console.log("variantManifest - flattened");
  console.log(JSON.stringify(flattenVariantManifest(variantManifest), null, 2));

  return `export type Color = ${colorUnion};
export type ColorVariant = ${colorUnion};
export type MakeColor = (tokenName: Color, options?: { variant?: ColorVariant; opacity?: number }) => string;

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
export const ${functionName}: MakeColor = (tokenName, options) => {
  const opacity = options?.opacity ?? 1;
  const variant = options?.variant ? \`\${options.variant}-\` : "";
  return \`rgba(var(${cssVarPrefix}-\${tokenName}-\${variant}rgb), \${opacity})\`;
};
`;
};

const css: CompileFunction = ({
  config,
  // cssVarPrefix,
}) => {
  console.log(config);
  return "";
  // let colorModels: ColorModels[] = [];

  // switch (brand.mode) {
  //   case "category": {
  //     colorModels = Object.entries(brand.hues).reduce<ColorModels[]>(
  //       (accum, [hueName, hueValue]) => {
  //         const hex = hsbToHex(hueValue, brand.saturation, brand.brightness);

  //         const baseColorModel = {
  //           name: hueName,
  //           hex,
  //           hsl: hsbToHsl(hueValue, brand.saturation, brand.brightness),
  //           rgb: hexToRgb(hex),
  //         };
  //         const variantColorModels = createColorModelVariants(baseColorModel, {
  //           strategy: "min-hex-max",
  //           ...brand.variants,
  //         });
  //         return accum.concat([baseColorModel, ...variantColorModels]);
  //       },
  //       []
  //     );
  //     break;
  //   }

  //   case "manual": {
  //     colorModels = Object.entries(brand.values).reduce<ColorModels[]>(
  //       (accum, [hexName, hexValue]) => {
  //         const baseColorModel = {
  //           name: hexName,
  //           hex: hexValue,
  //           hsl: hexToHsl(hexValue),
  //           rgb: hexToRgb(hexValue),
  //         };
  //         const variantColorModels = createColorModelVariants(baseColorModel, {
  //           strategy: "min-hex-max",
  //           ...brand.variants,
  //         });
  //         return accum.concat([baseColorModel, ...variantColorModels]);
  //       },
  //       []
  //     );
  //     break;
  //   }

  //   default:
  //     exhaustiveMatchGuard(brand);
  // }

  // const colorBrandTokens = createColorTokensFromColorModels(colorModels, {
  //   prefix: cssVarPrefix,
  // });

  // LOG.debug(colorBrandTokens);

  // return colorBrandTokens;
};

export const MakeTemplateColor = new MakeTemplate({
  functionName: "makeColor",
  functionDescription:
    "A utility that allows you to safely incorporate brand color into your apps by easily adding the design token along with optional adjustments & variants.",
  variableBody: "color",
  template,
  css,
});
