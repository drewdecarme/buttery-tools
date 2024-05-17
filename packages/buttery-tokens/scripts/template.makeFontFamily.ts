import { type CompileFunction, MakeTemplate } from "./MakeTemplate";

const template: CompileFunction = ({
  config,
  methods,
  functionName,
  variableBody,
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
 *
 * const aClassName = css\`
 *   font-family: \${makeFontFamily("${fontFamilyNames[0]}")};
 * \`
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
