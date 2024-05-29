import { hsbToHsl } from "../utils/util.color-conversions";
import { type CompileFunction, MakeTemplate } from "./MakeTemplate";

const template: CompileFunction = ({
  config,
  methods,
  docs,
  functionName,
  cssVarPrefix
}) => {
  const hueNames = Object.keys(config.color.hues);
  const hueUnion = methods.createTypeUnion(hueNames);

  const hueVariants = [...new Array(8)].map((_v, i) => {
    if (i === 0) return "50";
    return (i * 100).toString();
  });
  const hueVariantUnion = methods.createTypeUnion(hueVariants);

  return `export type Color = ${hueUnion};
export type ColorVariant = ${hueVariantUnion};
export type MakeColor = (color: Color, options?: { variant?: ColorVariant; opacity?: number }) => string;

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
 *        style={{ fontWeight: ${functionName}("${hueNames[0]}") }}
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
export const ${functionName}: MakeColor = (hue, options) => {
  console.log(hue, options);
  return \`hsl(var(${cssVarPrefix}-\${hue}-h), var(${cssVarPrefix}-\${hue}-s), var(${cssVarPrefix}-\${hue}-l))\`;
};
`;
};

const css: CompileFunction = ({ config, cssVarPrefix }) => {
  return Object.entries(config.color.hues).reduce(
    (accum, [hueName, hueValue]) => {
      const hsl = hsbToHsl(
        hueValue,
        config.color.saturation,
        config.color.brightness
      );
      const h = accum.concat(`  ${cssVarPrefix}-${hueName}-h: ${hsl.h};\n`);
      const s = accum.concat(`  ${cssVarPrefix}-${hueName}-s: ${hsl.s}%;\n`);
      const l = accum.concat(`  ${cssVarPrefix}-${hueName}-l: ${hsl.l}%;\n`);
      const base = accum.concat(h).concat(s).concat(l);

      return base;
    },
    ""
  );
};

export const MakeTemplateColor = new MakeTemplate({
  functionName: "makeColor",
  functionDescription: "A utility that allows you to incorporate color",
  variableBody: "color",
  template,
  css
});
