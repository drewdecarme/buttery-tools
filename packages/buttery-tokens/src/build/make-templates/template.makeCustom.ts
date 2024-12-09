import { type CompileFunction, MakeTemplate } from "./MakeTemplate.js";

const template: CompileFunction = ({
  config,
  docs,
  functionName,
  methods,
  cssVarPrefix,
}) => {
  const customTokenNames = Object.keys(config.custom ?? {});
  const customTokenUnion = methods.createTypeUnion(customTokenNames);
  return `export type CustomTokens = ${customTokenUnion};
export type MakeCustom = (tokenName: CustomTokens) => string | number;
  
/**
 * ## Description
 * ${docs.description}
 * 
 * It's important to note that the values that are associated with the token from
 * the config are going to be raw values. This is to ensure that there's not black
 * magic behind the scenes happening that makes the utility do more than just recall
 * the value with the token.
 * 
 * With that said, there are options on the method that will allow you to recall
 * the value and add some simple processing on it. For instance, if the token value
 * is a number you would be able to use an option in the \`${functionName}\` function
 * to convert that value to a rem.
 *
 * ## Usage
 * ### css-in-ts
 * \`\`\`ts
 * import { css } from "@linaria/core";
 * ${docs.importClause}
 *
 * const divClassName = css\`
 *   position: sticky;
 *   top: \${${functionName}(${customTokenNames[0]})};;
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
 *        style={{
 *          position: "sticky",
 *          top: ${functionName}(${customTokenNames}) }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * \`\`\`
 */
export const ${functionName}: MakeCustom = (value) => {
  return \`var(${cssVarPrefix}-\${value})\`
};
`;
};

const css: CompileFunction = ({ config, cssVarPrefix }) => {
  return Object.entries(config.custom ?? {}).reduce(
    (accum, [customToken, customTokenValue]) => {
      if (
        typeof customTokenValue === "string" ||
        typeof customTokenValue === "number"
      ) {
        return accum.concat(
          `\n${cssVarPrefix}-${customToken}: ${customTokenValue};`
        );
      }

      return accum.concat(
        `\n${cssVarPrefix}-${customToken}: ${
          customTokenValue.storeAsRem
            ? `${customTokenValue.value / (config.font?.baseSize ?? 16)}rem`
            : customTokenValue.value
        };`
      );
    },
    ""
  );
};

export const MakeTemplateCustom = new MakeTemplate({
  functionName: "makeCustom",
  functionDescription:
    "A utility that enables to reference and use custom tokens that are defined in the `buttery.config.ts` file.",
  variableBody: "custom",
  template,
  css,
});
