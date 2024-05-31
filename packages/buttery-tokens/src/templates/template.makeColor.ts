import chroma from "chroma-js";
import { hexToHsb, hsbToHex, hsbToHsl } from "../utils/util.color-conversions";
import { type CompileFunction, MakeTemplate } from "./MakeTemplate";

const template: CompileFunction = ({
  config,
  methods,
  docs,
  functionName,
  cssVarPrefix
}) => {
  const hueNames = Object.keys(config.color.hues);
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
 *        style={{ fontWeight: ${functionName}("${hueNames[0]}") }}
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
  return \`hsl(var(${cssVarPrefix}-\${hue}-h), var(${cssVarPrefix}-\${hue}-s), var(${cssVarPrefix}-\${hue}-l))\`;
};
`;
};

const createColorTokensBase = (
  hsl: ReturnType<typeof hsbToHsl>,
  options: { cssPrefix: string; name: string }
) =>
  Object.entries(hsl).reduce((iAccum, [key, value]) => {
    const unit = key !== "h" ? "%" : "";
    return iAccum.concat(
      `  ${options.cssPrefix}-${options.name}-${key}: ${value}${unit};\n`
    );
  }, "");

const createColorTokensVariants = ({
  hex,
  name,
  prefix,
  numOfVariants
}: { hex: string; name: string; prefix: string; numOfVariants: number }) => {
  const variants = chroma
    .scale([chroma(hex).brighten(2), hex, chroma(hex).darken(2)])
    .mode("lab")
    .colors(numOfVariants);

  const variantTokens = variants.reduce((iAccum, hueVariant, i) => {
    let hueVariantName: number;
    if (i === 0) {
      hueVariantName = 50;
    } else {
      hueVariantName = i * 100;
    }
    const { h, s, b } = hexToHsb(hueVariant);
    const variantHsl = hsbToHsl(h, s, b);
    const vh = `  ${prefix}-${name}-${hueVariantName}-h: ${variantHsl.h};\n`;
    const vS = `  ${prefix}-${name}-${hueVariantName}-s: ${variantHsl.s}%;\n`;
    const vL = `  ${prefix}-${name}-${hueVariantName}-l: ${variantHsl.l}%;\n`;
    return iAccum.concat(vh).concat(vS).concat(vL);
  }, "");
  return variantTokens;
};

const css: CompileFunction = ({ config, cssVarPrefix }) => {
  const numOfVariants = config.color.variants?.total ?? 10;

  const colorAndVariantTokens = Object.entries(config.color.hues).reduce(
    (accum, [hueName, hueValue]) => {
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
      const colorTokensBase = createColorTokensBase(colorBaseHsl, {
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
    },
    ""
  );

  // neutrals
  const neutralHsb = hexToHsb(config.color.neutral);
  const neutralHsl = hsbToHsl(neutralHsb.h, neutralHsb.s, neutralHsb.b);
  // create the neutral tokens - base
  const neutralTokensBase = createColorTokensBase(neutralHsl, {
    cssPrefix: cssVarPrefix,
    name: "neutral"
  });
  // create the neutral tokens - variants
  const neutralTokensVariant = createColorTokensVariants({
    hex: config.color.neutral,
    name: "neutral",
    prefix: cssVarPrefix,
    numOfVariants
  });

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
