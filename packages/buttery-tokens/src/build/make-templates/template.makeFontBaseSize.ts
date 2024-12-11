import { type CompileFunction, MakeTemplate } from "./MakeTemplate.js";

const template: CompileFunction = ({
  config,
  docs,
  functionName,
  cssVarPrefix,
}) => {
  const fontBaseSize = Object.keys(config.font?.baseSize ?? 16);

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
 *    font-size: \${${functionName}("${fontBaseSize}")};
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
  return `  ${cssVarPrefix}: ${config.font?.baseSize ?? 16};\n`;
};

export const MakeTemplateFontBaseSize = new MakeTemplate({
  functionName: "makeFontBaseSize",
  functionDescription:
    "Returns the token used to set the base font size of the document body.",
  variableBody: "font-base",
  template,
  css,
});
