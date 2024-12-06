import { type CompileFunction, MakeTemplate } from "./MakeTemplate.js";

const template: CompileFunction = ({ methods, docs, functionName }) => {
  const resetUnion = methods.createTypeUnion([
    "ul",
    "button",
    "body",
    "anchor",
  ]);

  return `export type MakeReset = (element: ${resetUnion}) => string;

const matchGuard = (_: never): never => {
  throw new Error(\`Forgot to include an \${_} in the switch statement\`);
};

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
 *   ul {
 *     \${${functionName}("ul")};
 * 
 *     li {
 *       height: 24px;
 *       width: 24px;
 *     }
 *   }
 * \`
 * \`\`\`
 */
export const ${functionName}: MakeReset = (element) => {
    switch(element) {
      case "ul":
        return \`
          margin: 0;
          padding: 0;

          li {
            margin: 0;
            padding: 0;
            list-style-type: none;
          }
        \`;

      case "button":
        return \`
          margin: 0;
          padding: 0;
          border: none;
          background: none;
        \`;

      case "body":
        return \`
          margin: 0;
          padding: 0;
        \`;

      case "anchor":
        return \`
          text-decoration: none;
          color: inherit;

          &:visited {
            color: inherit;
          }
        \`;

      default:
        return matchGuard(element);
    }
};
`;
};

const css: CompileFunction = () => "";

export const MakeTemplateReset = new MakeTemplate({
  functionName: "makeReset",
  functionDescription: "Returns some CSS resets for any given elements",
  variableBody: "",
  template,
  css,
});
