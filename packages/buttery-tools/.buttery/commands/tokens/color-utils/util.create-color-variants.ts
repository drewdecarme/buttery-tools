import chroma from "chroma-js";
import { match } from "ts-pattern";
import { exhaustiveMatchGuard } from "../../../../utils/ts";
import type { ButteryTokensColorBrandVariants } from "../../_buttery-config";
import {
  hexToHsl,
  hexToRgb,
  type hsbToHex,
  type hsbToHsl
} from "./util.color-conversions";

export type ColorModels = {
  name: string;
  hex: ReturnType<typeof hsbToHex>;
  rgb: ReturnType<typeof hexToRgb>;
  hsl: ReturnType<typeof hsbToHsl>;
};

export const createColorModelVariants = (
  baseColorModel: ColorModels,
  options: ButteryTokensColorBrandVariants & {
    strategy: "min-hex" | "min-hex-max" | "hex-max";
  }
): ColorModels[] => {
  switch (options.mode) {
    case "auto": {
      // resolve some options
      const min = options?.scaleMin ?? 2;
      const max = options?.scaleMax ?? 2;
      const numOfVariants = options.numOfVariants ?? 10;

      // get the lightest and darkest from the base
      const hexVariants = match(options.strategy)
        .with("min-hex-max", () => {
          const lightest = chroma(baseColorModel.hex).brighten(min);
          const darkest = chroma(baseColorModel.hex).darken(max);
          const scaleArr = [lightest, baseColorModel.hex, darkest];

          return chroma.scale(scaleArr).mode("lab").colors(numOfVariants);
        })
        .with("min-hex", () => {
          const lightest = chroma(baseColorModel.hex).brighten(min);
          const scaleArr = [lightest, baseColorModel.hex];

          return chroma.scale(scaleArr).mode("lab").colors(numOfVariants);
        })
        .with("hex-max", () => {
          const darkest = chroma(baseColorModel.hex).darken(max);
          const scaleArr = [baseColorModel.hex, darkest];

          return chroma.scale(scaleArr).mode("lab").colors(numOfVariants);
        })
        .exhaustive();

      // map through all of the hex variants and create models
      return hexVariants.map<ColorModels>((hex, i) => {
        const variantName = (i === 0 ? 50 : i * 100).toString();
        return {
          name: `${baseColorModel.name}-${variantName}`,
          hex,
          hsl: hexToHsl(hex),
          rgb: hexToRgb(hex)
        };
      });
    }

    case "manual": {
      // remove the mode from the config and
      // use the rest of the key value pairs on this as variantName value pairs
      const { mode, ...restVariants } = options;

      // Map through all of the variants and create models
      return Object.entries(restVariants).map<ColorModels>(
        ([variantName, variantHex]) => {
          return {
            name: `${baseColorModel.name}-${variantName}`,
            hex: variantHex,
            hsl: hexToHsl(variantHex),
            rgb: hexToRgb(variantHex)
          };
        }
      );
    }

    default:
      return exhaustiveMatchGuard(options);
  }
};

/**
 * Reduces through all of the color models and creates
 * color design tokens out of them.
 * TODO: UNIT TEST
 */
export function createColorTokensFromColorModels(
  colorModels: ColorModels[],
  options: { prefix: string }
): string {
  return colorModels.reduce((accum, colorModel) => {
    const colorHsl = `${options.prefix}-${colorModel.name}-hsl: ${colorModel.hsl.h}%, ${colorModel.hsl.l}, ${colorModel.hsl.s};\n`;
    const colorRgb = `${options.prefix}-${colorModel.name}-rgb: ${colorModel.rgb.r}, ${colorModel.rgb.b}, ${colorModel.rgb.b};\n`;
    const colorHex = `${options.prefix}-${colorModel.name}-hex: ${colorModel.hex};\n`;
    return accum.concat(`${colorHex}${colorRgb}${colorHsl}`);
  }, "");
}
