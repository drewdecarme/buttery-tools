import chroma from "chroma-js";

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
  return variants;
};
