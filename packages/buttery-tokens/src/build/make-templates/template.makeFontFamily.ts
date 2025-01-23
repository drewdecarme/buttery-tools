import { match } from "ts-pattern";

import { type CompileFunction, MakeTemplate } from "./MakeTemplate.js";

const template: CompileFunction = ({
  config,
  docs,
  methods,
  functionName,
  cssVarPrefix,
}) => {
  const fontFamilyNames = match(config.font)
    .with({ source: "manual" }, (state) => {
      return Object.keys(state.families);
    })
    .otherwise((state) => {
      return Object.keys(state.families);
    });
  const fontFamilyUnion = methods.createTypeUnion(fontFamilyNames);

  return `export type FontFamily = ${fontFamilyUnion};
export type MakeFontFamily = (fontFamilyName: FontFamily) => string;

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
 *   font-family: \${${functionName}("${fontFamilyNames[0]}")};
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
 *        style={{ fontFamily: ${functionName}("${fontFamilyNames[1]}") }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * \`\`\`
 */
export const ${functionName}: MakeFontFamily = (value) => {
    return \`var(${cssVarPrefix}-\${value})\`
};
`;
};

const css: CompileFunction = ({ config, cssVarPrefix }) => {
  return Object.entries(config.font?.families ?? {}).reduce(
    (accum, [fontFamilyName, fontFamilyValue]) =>
      accum.concat(
        `  ${cssVarPrefix}-${fontFamilyName}: "${fontFamilyName}", ${fontFamilyValue.fallback};\n`
      ),
    ""
  );
};

export const MakeTemplateFontFamily = new MakeTemplate({
  functionName: "makeFontFamily",
  functionDescription:
    "A utility that returns the CSS variable assigned to the font-family`",
  variableBody: "font-family",
  template,
  css,
});
