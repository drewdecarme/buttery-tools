import chroma from "chroma-js";
import { hexToHsb, hsbToHsl } from "./util.color-conversions";

// TODO: Not sure if I like the signature of this function with min and max
export const createColorVariants = (
  hex: string,
  numberOfVariants = 10,
  options?: { min?: number; max?: number }
) => {
  const min = options?.min ?? 2;
  const scaleArr = options?.max
    ? [chroma(hex).brighten(min), hex, chroma(hex).darken(options.max)]
    : [chroma(hex).brighten(min), hex];
  const variants = chroma.scale(scaleArr).mode("lab").colors(numberOfVariants);
  return variants.map((v, i) => ({ name: i === 0 ? 50 : i * 100, value: v }));
};

export const createColorTokens = (
  hsl: ReturnType<typeof hsbToHsl>,
  options: { cssPrefix: string; name: string }
) =>
  Object.entries(hsl).reduce((iAccum, [key, value]) => {
    const unit = key !== "h" ? "%" : "";
    return iAccum.concat(
      `  ${options.cssPrefix}-${options.name}-${key}: ${value}${unit};\n`
    );
  }, "");

export const createColorTokensVariants = ({
  hex,
  name,
  prefix,
  numOfVariants,
  options
}: {
  hex: string;
  name: string;
  prefix: string;
  numOfVariants: number;
  options?: { min?: number; max?: number };
}) => {
  const variants = createColorVariants(hex, numOfVariants, options);

  const variantTokens = variants.reduce(
    (iAccum, { name: hueVariantName, value: hueVariant }) => {
      const { h, s, b } = hexToHsb(hueVariant);
      const variantHsl = hsbToHsl(h, s, b);
      const vh = `  ${prefix}-${name}-${hueVariantName}-h: ${variantHsl.h};\n`;
      const vS = `  ${prefix}-${name}-${hueVariantName}-s: ${variantHsl.s}%;\n`;
      const vL = `  ${prefix}-${name}-${hueVariantName}-l: ${variantHsl.l}%;\n`;
      return iAccum.concat(vh).concat(vS).concat(vL);
    },
    ""
  );
  return variantTokens;
};
