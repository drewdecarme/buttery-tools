import { type CompileFunction, MakeTemplate } from "./MakeTemplate";

const template: CompileFunction = ({
  config,
  methods,
  docs,
  functionName,
  cssVarPrefix
}) => {
  const breakpointNames = Object.keys(config.breakpoints);
  const breakpointUnion = methods.createTypeUnion(breakpointNames);

  return `export type Breakpoints = ${breakpointUnion};
export type MakeResponsive = (params: { from?: Breakpoints, to?: Breakpoints }) => string;

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
 *   \${makeResponsive({ from: "${breakpointNames[0]}" })} {
 *     display: none;
 *   }
 * \`
 * \`\`\`
 */
export const ${functionName}: MakeResponsive = (params) => {
    const from = params?.from ? \`var(${cssVarPrefix}-\${params.from})\` : undefined;
    const to = params?.to ? \`calc(var(${cssVarPrefix}-\${params.to}) - 1px)\` : undefined;
    if (from && to) {
      return \`@media (min-width: \${from}) and @media (max-width:\${to})\`;
    }
    if (from && !to) {
      return \`@media (min-width: \${from})\`;
    }
    if (to && !from) {
      return \`@media (max-width: \${to})\`;
    }
    throw new Error("You must provide a to or from parameter.")
};
`;
};

const css: CompileFunction = ({ config, cssVarPrefix }) => {
  return Object.entries(config.breakpoints).reduce(
    (accum, [breakpointName, breakpointValue]) =>
      accum.concat(
        `  ${cssVarPrefix}-${breakpointName}: ${breakpointValue}px;\n`
      ),
    ""
  );
};

export const MakeTemplateResponsive = new MakeTemplate({
  functionName: "makeResponsive",
  functionDescription: `A utility that enables you to easily create a \`@media\`
string that can be interpolated in CSS-in-JS syntax.`,
  variableBody: "breakpoint",
  template,
  css
});
