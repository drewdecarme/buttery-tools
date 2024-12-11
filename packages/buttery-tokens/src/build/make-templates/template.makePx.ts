import { type CompileFunction, MakeTemplate } from "./MakeTemplate.js";

const template: CompileFunction = ({ docs, functionName }) => {
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
 *   font-size: \${${functionName}(12)};
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
 *        style={{ fontSize: ${functionName}(12) }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * \`\`\`
 */
export const ${functionName} = (val: number) => \`\${val}px\`;
`;
};

export const MakeTemplatePx = new MakeTemplate({
  functionName: "makePx",
  functionDescription:
    "A utility that concatenates 'px' onto the end of the provided value",
  variableBody: "",
  template,
  css: () => "",
});
