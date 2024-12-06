import { type CompileFunction, MakeTemplate } from "./MakeTemplate.js";

import { hexToHsl, hexToRgb } from "../../utils/util.color-conversions.js";
import {
  type ColorModels,
  createColorTokensFromColorModels,
} from "../../utils/util.create-color-variants.js";

const template: CompileFunction = ({
  config,
  methods,
  docs,
  functionName,
  cssVarPrefix,
}) => {
  const staticColorNames = Object.keys(config.color.static ?? {});
  const staticColorUnion = methods.createTypeUnion(staticColorNames);

  return `export type ColorStatic = ${staticColorUnion};
export type MakeColorStatic = (tokenName: ColorStatic, options?: { opacity?: number }) => string;

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
 *        style={{ color: ${functionName}("${staticColorNames[0]}") }}
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
export const ${functionName}: MakeColorStatic = (tokenName, options) => {
  const opacity = options?.opacity ?? 1;
  return \`rgba(var(${cssVarPrefix}-\${tokenName}-rgb), \${opacity})\`;
};
`;
};

const css: CompileFunction = ({ config: { color }, cssVarPrefix }) => {
  const colorModels = Object.entries(color.static ?? {}).reduce<ColorModels[]>(
    (accum, [hexName, hexValue]) =>
      accum.concat({
        name: hexName,
        hex: hexValue,
        hsl: hexToHsl(hexValue),
        rgb: hexToRgb(hexValue),
      }),
    []
  );

  const colorStaticTokens = createColorTokensFromColorModels(colorModels, {
    prefix: cssVarPrefix,
  });
  return colorStaticTokens;
};

export const MakeTemplateColorStatic = new MakeTemplate({
  functionName: "makeColorStatic",
  functionDescription:
    "A utility that allows you to utilize static colors that are defined outside of the boundaries of the harmonious color presets",
  variableBody: "color-static",
  template,
  css,
});
