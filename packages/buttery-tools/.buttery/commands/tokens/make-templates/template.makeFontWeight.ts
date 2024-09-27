import { type CompileFunction, MakeTemplate } from "./MakeTemplate";

const template: CompileFunction = ({
  config,
  methods,
  docs,
  functionName,
  cssVarPrefix,
}) => {
  const fontWeightNames = Object.keys(config.font.weight);
  const fontWeightUnion = methods.createTypeUnion(fontWeightNames);

  return `export type FontWeight = ${fontWeightUnion};
export type MakeFontWeight = (fontWeightName: FontWeight) => string;

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
 * const aClassName = css\`
 *   font-weight: \${${functionName}("${fontWeightNames[0]}")};
 * \`
 * \`\`\`
 * 
 * ### style-object
 * \`\`\`ts
 * import { forwardRef } from "react"
 * ${docs.importClause}
 * 
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ fontWeight: ${functionName}("${fontWeightNames[0]}") }}
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
  functionDescription:
    "A utility that returns the CSS variable assigned to keys of the `font.family` that are defined in the `buttery.config.ts`",
  variableBody: "font-weight",
  template,
  css,
});
