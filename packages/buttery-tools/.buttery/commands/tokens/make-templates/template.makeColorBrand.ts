import { match } from "ts-pattern";

import { exhaustiveMatchGuard } from "../../../../lib/buttery-components";
import { LOG } from "../../_logger";
import {
  hexToHsl,
  hexToRgb,
  hsbToHex,
  hsbToHsl
} from "../color-utils/util.color-conversions";
import {
  type ColorModels,
  createColorBrandModelVariants,
  createColorTokensFromColorModels
} from "../color-utils/util.create-color-variants";
import { type CompileFunction, MakeTemplate } from "./MakeTemplate";

const template: CompileFunction = ({
  config,
  methods,
  docs,
  functionName,
  cssVarPrefix
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
    ...new Array(config.color.brand.variants.numOfVariants)
  ].map((_v, i) => {
    if (i === 0) return "50";
    return (i * 100).toString();
  });
  const hueVariantUnion = methods.createTypeUnion(hueVariants);

  return `export type Color = ${hueUnion};
export type ColorVariant = ${hueVariantUnion};
export type MakeColorBrand = (tokenName: Color, options?: { variant?: ColorVariant; opacity?: number }) => string;

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
  const variant = options?.variant ? \`\${options.variant}\` : "";
  return \`hsla(var(${cssVarPrefix}-\${tokenName}-\${variant}-hsl), \${opacity})\`;
};
`;
};

const css: CompileFunction = ({
  config: {
    color: { brand }
  },
  cssVarPrefix
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
            rgb: hexToRgb(hex)
          };
          const variantColorModels = createColorBrandModelVariants(
            baseColorModel,
            brand.variants
          );
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
            rgb: hexToRgb(hexValue)
          };
          const variantColorModels = createColorBrandModelVariants(
            baseColorModel,
            brand.variants
          );
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
    prefix: cssVarPrefix
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
  css
});
