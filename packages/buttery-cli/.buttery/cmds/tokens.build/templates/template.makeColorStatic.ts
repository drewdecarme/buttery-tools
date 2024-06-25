import { hexToHsb, hsbToHsl } from "../utils/util.color-conversions";
import { createColorTokens } from "../utils/util.create-color-variants";
import { type CompileFunction, MakeTemplate } from "./MakeTemplate";

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
export type MakeColorStatic = (color: ColorStatic, options?: { opacity?: number }) => string;

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
export const ${functionName}: MakeColorStatic = (color, options) => {
  const opacity = options?.opacity ?? 1;
  return \`hsla(var(${cssVarPrefix}-\${color}-h), var(${cssVarPrefix}-\${color}-s), var(${cssVarPrefix}-\${color}-l), \${opacity})\`;
};
`;
};

const css: CompileFunction = ({ config, cssVarPrefix }) => {
  const colorAndVariantTokens = Object.entries(
    config.color.static ?? {}
  ).reduce((accum, [staticName, staticHex]) => {
    const { h, s, b } = hexToHsb(staticHex);
    const colorBaseHsl = hsbToHsl(h, s, b);

    // create the color tokens - base
    const colorTokensBase = createColorTokens(colorBaseHsl, {
      cssPrefix: cssVarPrefix,
      name: staticName,
    });

    return accum.concat(colorTokensBase);
  }, "");

  return colorAndVariantTokens;
};

export const MakeTemplateColorStatic = new MakeTemplate({
  functionName: "makeColorStatic",
  functionDescription:
    "A utility that allows you to utilize static colors that are defined outside of the boundaries of the harmonious color presets",
  variableBody: "color-static",
  template,
  css,
});
