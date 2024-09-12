import { match } from "ts-pattern";
import {
  hexToHsb,
  hsbToHex,
  hsbToHsl
} from "../library/util.color-conversions";
import {
  createColorTokens,
  createColorTokensVariants
} from "../library/util.create-color-variants";
import { type CompileFunction, MakeTemplate } from "./MakeTemplate";

const template: CompileFunction = ({
  config,
  methods,
  docs,
  functionName,
  cssVarPrefix
}) => {
  const hueNames = Object.keys(config.color.application.hues).concat("neutral");
  const hueUnion = methods.createTypeUnion(hueNames);

  const hueVariants = [...new Array(8)].map((_v, i) => {
    if (i === 0) return "50";
    return (i * 100).toString();
  });
  const hueVariantUnion = methods.createTypeUnion(hueVariants);

  return `export type Color = ${hueUnion};
export type ColorVariant = ${hueVariantUnion};
export type MakeColor = (color: Color, options?: { variant?: ColorVariant; opacity?: number }) => string;

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
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ color: ${functionName}("${hueNames[0]}") }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * 
 * \`
 * \`\`\`
 */
export const ${functionName}: MakeColor = (hue, options) => {
  console.log(hue, options);
  const opacity = options?.opacity ?? 1;
  const variant = options?.variant ? \`-\${options.variant}\` : "";
  return \`hsla(var(${cssVarPrefix}-\${hue}\${variant}-h), var(${cssVarPrefix}-\${hue}\${variant}-s), var(${cssVarPrefix}-\${hue}\${variant}-l), \${opacity})\`;
};
`;
};

const css: CompileFunction = ({ config, cssVarPrefix }) => {
  const numOfVariants = match(config.color)
    .with(
      { mode: "presets", application: { variants: { mode: "auto" } } },
      (colorConfig) => colorConfig.application.variants.total ?? 10
    )
    .with(
      { mode: "presets", application: { variants: { mode: "manual" } } },
      (colorConfig) => {
        return Object.keys(colorConfig.application.variants).length;
      }
    )
    .with({ mode: "harmonious" }, () => {
      // TODO: build out harmonious variants
      return 0;
    })
    .exhaustive();

  const colorAndVariantTokens = Object.entries(
    config.color.application.hues
  ).reduce((accum, [hueName, hueValue]) => {
    const hueHex = hsbToHex(
      hueValue,
      config.color.saturation,
      config.color.brightness
    );
    const colorBaseHsl = hsbToHsl(
      hueValue,
      config.color.saturation,
      config.color.brightness
    );

    // create the color tokens - base
    const colorTokensBase = createColorTokens(colorBaseHsl, {
      cssPrefix: cssVarPrefix,
      name: hueName
    });

    // create the color tokens - variants
    const colorTokensVariant = createColorTokensVariants({
      hex: hueHex,
      name: hueName,
      prefix: cssVarPrefix,
      numOfVariants
    });
    return accum.concat(colorTokensBase).concat(colorTokensVariant);
  }, "");

  // neutrals
  const neutralHsb = hexToHsb(config.color.neutral.base);
  const neutralHsl = hsbToHsl(neutralHsb.h, neutralHsb.s, neutralHsb.b);
  // create the neutral tokens - base
  const neutralTokensBase = createColorTokens(neutralHsl, {
    cssPrefix: cssVarPrefix,
    name: "neutral"
  });
  // create the neutral tokens - variants
  const neutralTokensVariant = createColorTokensVariants({
    hex: config.color.neutral.base,
    name: "neutral",
    prefix: cssVarPrefix,
    numOfVariants,
    options: {
      min: Number(config.color.neutral.variants.scaleMin) ?? 10,
      max: Number(config.color.neutral.variants.scaleMax)
    }
  });

  // static colors

  return colorAndVariantTokens
    .concat(neutralTokensBase)
    .concat(neutralTokensVariant);
};

export const MakeTemplateColor = new MakeTemplate({
  functionName: "makeColor",
  functionDescription: "A utility that allows you to incorporate color",
  variableBody: "color",
  template,
  css
});
