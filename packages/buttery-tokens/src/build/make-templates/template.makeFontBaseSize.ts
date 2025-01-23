import { type CompileFunction, MakeTemplate } from "./MakeTemplate.js";

const template: CompileFunction = ({
  config,
  docs,
  functionName,
  cssVarPrefix,
}) => {
  return `export type MakeFontBaseSize = (token: number) => string;

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
 * const bodyStyles = css\`
 *  body: {
 *    font-size: \${${functionName}("${config.sizeAndSpace.baseFontSize}")};
 *  }
 *   
 * \`
 * \`\`\`
 */
export const ${functionName}: MakeFontBaseSize = (value) => {
    return \`var(${cssVarPrefix}-\${value})\`
};
`;
};

const css: CompileFunction = ({ config, cssVarPrefix }) => {
  return `  ${cssVarPrefix}: ${config.sizeAndSpace.baseFontSize};\n`;
};

export const MakeTemplateFontBaseSize = new MakeTemplate({
  functionName: "makeFontBaseSize",
  functionDescription:
    "Returns the token used to set the base font size of the document body.",
  variableBody: "font-base",
  template,
  css,
});
