import { type CompileFunction, MakeTemplate } from "./MakeTemplate";

const template: CompileFunction = ({
  config,
  methods,
  functionName,
  cssVarPrefix
}) => {
  const fontFamilyNames = Object.keys(config.font.family);
  const fontFamilyUnion = methods.createTypeUnion(fontFamilyNames);

  return `type FontFamily = ${fontFamilyUnion};
export type MakeFontFamily = (fontFamilyName: FontFamily) => string;

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
 * import { makeFontFamily } from "@buttery/tokens/js"
 *
 * const aClassName = css\`
 *   font-family: \${makeFontFamily("${fontFamilyNames[0]}")};
 * \`
 * \`\`\`
 * 
 * ### style-object
 * \`\`\`ts
 * import { forwardRef } from "react"
 * import { makeFontFamily } from "@buttery/tokens/js"
 * 
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ fontFamily: makeFontFamily("${fontFamilyNames[1]}") }}
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
  return Object.entries(config.font.family).reduce(
    (accum, [fontFamilyName, fontFamilyValue]) =>
      accum.concat(
        `  ${cssVarPrefix}-${fontFamilyName}: ${fontFamilyValue};\n`
      ),
    ""
  );
};

export const MakeTemplateFontFamily = new MakeTemplate({
  functionName: "makeFontFamily",
  variableBody: "font-family",
  template,
  css
});
