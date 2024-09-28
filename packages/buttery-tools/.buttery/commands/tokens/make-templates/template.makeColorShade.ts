import { LOG } from "../../../../lib/logger/LOG_CLI";
import { hexToHsl, hexToRgb } from "../color-utils/util.color-conversions";
import {
  type ColorModels,
  createColorModelVariants,
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
  const shadeNames = Object.keys(config.color.shade.values);
  const shadeUnion = methods.createTypeUnion(shadeNames);

  const shadeVariants = [
    ...new Array(config.color.shade.variants.numOfVariants)
  ].map((_v, i) => {
    if (i === 0) return "50";
    return (i * 100).toString();
  });
  const shadeVariantUnion = methods.createTypeUnion(shadeVariants);

  return `export type ColorShade = ${shadeUnion};
export type ColorShadeVariant = ${shadeVariantUnion};
export type MakeColorShade = (tokenName: ColorShade, options?: { variant?: ColorShadeVariant; opacity?: number }) => string;

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
 *        style={{ color: ${functionName}("${shadeNames[0]}") }}
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
export const ${functionName}: MakeColorShade = (tokenName, options) => {
  const opacity = options?.opacity ?? 1;
  const variant = options?.variant ? \`\${options.variant}-\` : "";
  return \`rgba(var(${cssVarPrefix}-\${tokenName}-\${variant}rgb), \${opacity})\`;
};
`;
};

const css: CompileFunction = ({
  config: {
    color: {
      shade: { variants, values: shades }
    }
  },
  cssVarPrefix
}) => {
  const colorModels: ColorModels[] = Object.entries(shades).reduce<
    ColorModels[]
  >((accum, [hexName, hexValue]) => {
    const baseColorModel = {
      name: hexName,
      hex: hexValue,
      hsl: hexToHsl(hexValue),
      rgb: hexToRgb(hexValue)
    };
    const variantColorModels = createColorModelVariants(baseColorModel, {
      strategy: "min-hex",
      ...variants
    });
    return accum.concat([baseColorModel, ...variantColorModels]);
  }, []);

  const colorShadeTokens = createColorTokensFromColorModels(colorModels, {
    prefix: cssVarPrefix
  });

  LOG.debug(colorShadeTokens);

  return colorShadeTokens;
};

export const MakeTemplateColorShade = new MakeTemplate({
  functionName: "makeColorShade",
  functionDescription:
    "A utility that allows you to safely incorporate shades into your apps by easily adding the design token along with optional adjustments & variants.",
  variableBody: "color-shade",
  template,
  css
});
