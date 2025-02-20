import { type CompileFunction, MakeTemplate } from "./MakeTemplate.js";

const template: CompileFunction = ({ config, docs, functionName }) => {
  return `/**
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
 *   font-size: \${makeRem(12)};
 * \`
 * \`\`\`
 * 
 * ### style-object
 * \`\`\`ts
 * import { forwardRef } from "react"
 * ${docs.importClause};
 * 
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ fontSize: makeRem(12) }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * \`\`\`
 */
export const ${functionName} = (pixel: number) => \`\${pixel / ${config.sizeAndSpace.baseFontSize}}rem\`;`;
};

const css: CompileFunction = ({ config, cssVarPrefix }) => {
  return `${cssVarPrefix}: ${config.sizeAndSpace.baseFontSize};`;
};

export const MakeTemplateRem = new MakeTemplate({
  functionName: "makeRem",
  functionDescription:
    "A utility that returns the rem value of the pixel number provided. This utility is intended to reduce the mental load of translating pixel units (that are commonly provided in design assets) into rem units which are necessary for creating interfaces that scale with browser defaults & zoom levels.",
  variableBody: "font-size",
  template,
  css,
});
