import { exhaustiveMatchGuard } from "@buttery/utils/isomorphic";

import type {
  ButteryTokensConfigSpaceAndSize,
  SpaceAuto,
} from "../schemas/schema.size-and-space.js";

export function calculateSpaceVariantsAuto(
  variants: SpaceAuto["variants"],
  baselineGrid: number,
  factor = 1
) {
  const variantArr =
    typeof variants === "number"
      ? [...new Array(variants)].map((_, i) => i.toString())
      : variants;
  return variantArr.reduce<Record<string, number>>((accum, variantName, i) => {
    if (factor === 1) {
      return Object.assign(accum, {
        [variantName]: baselineGrid * (i + 1),
      });
    }
    return Object.assign(accum, {
      [variantName]: baselineGrid * Math.pow(factor, i),
    });
  }, {});
}

export function createSpaceVariants(
  size: ButteryTokensConfigSpaceAndSize
): Record<string, number> {
  switch (size.space.mode) {
    case "auto": {
      return calculateSpaceVariantsAuto(
        size.space.variants,
        size.baselineGrid,
        size.space.factor
      );
    }

    case "manual": {
      return size.space.variants;
    }

    default:
      return exhaustiveMatchGuard(size.space);
  }
}
