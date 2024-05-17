import { type CompileFunction, MakeTemplate } from "./MakeTemplate";

const template: CompileFunction = ({
  config,
  methods,
  functionName,
  cssVarPrefix
}) => {
  const fontWeightNames = Object.keys(config.font.weight);
  const fontWeightUnion = methods.createTypeUnion(fontWeightNames);

  return `export type FontWeight = ${fontWeightUnion};
export type MakeFontWeight = (fontWeightName: FontWeight) => string;

/**
 * ## Description
 * A utility that returns the CSS variable assigned
 * to keys of the \`font.family\` that are defined
 * in the \`buttery.config.ts\`
 *
 * ## Usage
 * ### css-in-ts
 * \`\`\`ts
 * import { css } from "@linaria/core";
 * import { makeFontWeight } from "@buttery/tokens/js"
 *
 * const aClassName = css\`
 *   font-family: \${makeFontWeight("${fontWeightNames[0]}")};
 * \`
 * \`\`\`
 * 
 * ### style-object
 * \`\`\`ts
 * import { forwardRef } from "react"
 * import { makeFontWeight } from "@buttery/tokens/js"
 * 
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ fontWeight: makeFontWeight("${fontWeightNames[1]}") }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * \`\`\`
 */
export const ${functionName}: MakeFontWeight = (value) => {
    return \`var(${cssVarPrefix}-\${value})\`
};
`;
};

const css: CompileFunction = ({ config, cssVarPrefix }) => {
  return Object.entries(config.font.weight).reduce(
    (accum, [fontWeightName, fontWeightValue]) =>
      accum.concat(
        `  ${cssVarPrefix}-${fontWeightName}: ${fontWeightValue};\n`
      ),
    ""
  );
};

export const MakeTemplateFontWeight = new MakeTemplate({
  functionName: "makeFontWeight",
  variableBody: "font-weight",
  template,
  css
});
