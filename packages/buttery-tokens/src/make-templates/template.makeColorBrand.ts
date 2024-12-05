import { match } from "ts-pattern";
import { exhaustiveMatchGuard } from "@buttery/core/utils/isomorphic";

import { type CompileFunction, MakeTemplate } from "./MakeTemplate";

import {
  hexToHsl,
  hexToRgb,
  hsbToHex,
  hsbToHsl,
} from "../color-utils/util.color-conversions";
import {
  type ColorModels,
  createColorModelVariants,
  createColorTokensFromColorModels,
} from "../color-utils/util.create-color-variants";
import { LOG } from "../logger";

const template: CompileFunction = ({
  config,
  methods,
  docs,
  functionName,
  cssVarPrefix,
}) => {
  const hueNames = match(config.color.brand)
    .with({ mode: "category" }, (catConfig) => {
      // the keys of the hues object
      return Object.keys(catConfig.hues);
    })
    .with({ mode: "manual" }, (manConfig) => {
      // the keys of the values object
      return Object.keys(manConfig.values);
    })
    .exhaustive();
  const hueUnion = methods.createTypeUnion(hueNames);

  const hueVariants = [
    ...new Array(config.color.brand.variants.numOfVariants),
  ].map((_v, i) => {
    if (i === 0) return "50";
    return (i * 100).toString();
  });
  const hueVariantUnion = methods.createTypeUnion(hueVariants);

  return `export type ColorBrand = ${hueUnion};
export type ColorBrandVariant = ${hueVariantUnion};
export type MakeColorBrand = (tokenName: ColorBrand, options?: { variant?: ColorBrandVariant; opacity?: number }) => string;

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
 *        style={{ color: ${functionName}("${hueNames[0]}") }}
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
export const ${functionName}: MakeColorBrand = (tokenName, options) => {
  const opacity = options?.opacity ?? 1;
  const variant = options?.variant ? \`\${options.variant}-\` : "";
  return \`rgba(var(${cssVarPrefix}-\${tokenName}-\${variant}rgb), \${opacity})\`;
};
`;
};

const css: CompileFunction = ({
  config: {
    color: { brand },
  },
  cssVarPrefix,
}) => {
  let colorModels: ColorModels[] = [];

  switch (brand.mode) {
    case "category": {
      colorModels = Object.entries(brand.hues).reduce<ColorModels[]>(
        (accum, [hueName, hueValue]) => {
          const hex = hsbToHex(hueValue, brand.saturation, brand.brightness);

          const baseColorModel = {
            name: hueName,
            hex,
            hsl: hsbToHsl(hueValue, brand.saturation, brand.brightness),
            rgb: hexToRgb(hex),
          };
          const variantColorModels = createColorModelVariants(baseColorModel, {
            strategy: "min-hex-max",
            ...brand.variants,
          });
          return accum.concat([baseColorModel, ...variantColorModels]);
        },
        []
      );
      break;
    }

    case "manual": {
      colorModels = Object.entries(brand.values).reduce<ColorModels[]>(
        (accum, [hexName, hexValue]) => {
          const baseColorModel = {
            name: hexName,
            hex: hexValue,
            hsl: hexToHsl(hexValue),
            rgb: hexToRgb(hexValue),
          };
          const variantColorModels = createColorModelVariants(baseColorModel, {
            strategy: "min-hex-max",
            ...brand.variants,
          });
          return accum.concat([baseColorModel, ...variantColorModels]);
        },
        []
      );
      break;
    }

    default:
      exhaustiveMatchGuard(brand);
  }

  const colorBrandTokens = createColorTokensFromColorModels(colorModels, {
    prefix: cssVarPrefix,
  });

  LOG.debug(colorBrandTokens);

  return colorBrandTokens;
};

export const MakeTemplateColorBrand = new MakeTemplate({
  functionName: "makeColorBrand",
  functionDescription:
    "A utility that allows you to safely incorporate brand color into your apps by easily adding the design token along with optional adjustments & variants.",
  variableBody: "color-brand",
  template,
  css,
});
