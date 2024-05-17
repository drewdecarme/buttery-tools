import { MakeTemplate, type TemplateFunction } from "./Template";

const template: TemplateFunction = (config, methods, functionName) => {
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
 *   font-family: \${makeFontFamily("${fontFamilyNames[0]}")}
 * \`
 * \`\`\`
 */
export const ${functionName}: MakeFontFamily = (value) => {
    return \`var(--${config.prefix}-font-family-\${value})\`
};
`;
};

export const MakeTemplateFontFamily = new MakeTemplate({
  functionName: "makeFontFamily",
  template
});
