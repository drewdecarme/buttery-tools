import { match } from "ts-pattern";
import type { ButteryTokensConfig } from "@buttery/tokens-utils/schemas";

import { type CompileFunction, MakeTemplate } from "./MakeTemplate.js";

import { LOG } from "../../utils/util.logger.js";

const getFamilyAndWeights = (config: ButteryTokensConfig): string[] => {
  const familyNameAndWeightName = match(config.font)
    .with({ source: "manual" }, (state) => {
      return Object.entries(state.families).reduce<string[]>(
        (accum, [familyName, familyDef]) => {
          for (const style of familyDef.styles) {
            const weightOnly = style.split("-")[0];
            accum.push(`${familyName}-${weightOnly}`);
          }
          return accum;
        },
        []
      );
    })
    .otherwise((state) => {
      return Object.keys(state.families);
    });
  return familyNameAndWeightName;
};

const template: CompileFunction = ({
  config,
  methods,
  docs,
  functionName,
  cssVarPrefix,
}) => {
  const familyNameAndWeightName = getFamilyAndWeights(config);
  const fontWeightUnion = methods.createTypeUnion(familyNameAndWeightName);

  return `export type FontFamilyAndWeight = ${fontWeightUnion};
export type MakeFontWeight = (fontWeightName: FontFamilyAndWeight) => string;

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
 * const styles = css\`
 *   font-weight: \${${functionName}("${familyNameAndWeightName[0]}")};
 * \`
 * \`\`\`
 * 
 * ### style-object
 * \`\`\`ts
 * import { forwardRef } from "react"
 * ${docs.importClause}
 * 
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ fontWeight: ${functionName}("${familyNameAndWeightName[0]}") }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * \`\`\`
 */
export const ${functionName}: MakeFontWeight = (fontFamilyAndWeight) => {
    return \`var(${cssVarPrefix}-\${fontFamilyAndWeight})\`
};
`;
};

const css: CompileFunction = ({ config, cssVarPrefix }) => {
  const familyNameAndWeightName = getFamilyAndWeights(config);

  return familyNameAndWeightName.reduce((accum, fontFamilyAndWeightName) => {
    const [familyName, weightName] = fontFamilyAndWeightName.split("-");

    switch (config.font.source) {
      case "manual": {
        const name = familyName as keyof typeof config.font.families;
        const styles = config.font.families[name].styles;
        const style = styles.find((s) => s.startsWith(weightName));
        if (!style) {
          throw LOG.fatal(
            new Error(
              `Cannot find a ${name} style that beings with ${weightName}. This should not have happened. Please log a Github issue.`
            )
          );
        }
        const weightValue = style.split("-")[1];
        return accum.concat(
          `  ${cssVarPrefix}-${fontFamilyAndWeightName}: ${weightValue};\n`
        );
      }

      default:
        return accum;
    }
  }, "");
};

export const MakeTemplateFontWeight = new MakeTemplate({
  functionName: "makeFontWeight",
  functionDescription:
    "A utility that returns the CSS variable assigned to keys of the `font.family` that are defined in the `buttery.config.ts`",
  variableBody: "font-weight",
  template,
  css,
});
