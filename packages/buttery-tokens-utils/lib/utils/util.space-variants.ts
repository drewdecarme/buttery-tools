import { exhaustiveMatchGuard } from "@buttery/utils/isomorphic";

import type {
  ButteryTokensConfigSizeAndSpace,
  SpaceAuto,
  SpaceManual,
} from "../schemas/schema.size-and-space.js";

export type SpaceVariantsRecord = Record<string, number>;

export function calculateSpaceVariantAutoValue(
  i: number,
  baselineGrid: number,
  factor = 1
) {
  return factor === 1
    ? baselineGrid * (i + 1)
    : baselineGrid * Math.pow(factor, i);
}

export function calculateSpaceVariantsAuto(
  variants: SpaceAuto["variants"],
  baselineGrid: number,
  factor = 1
): SpaceVariantsRecord {
  const variantArr =
    typeof variants === "number"
      ? [...new Array(variants)].map((_, i) => (i + 1).toString())
      : variants;
  const transformedVariants = variantArr.reduce<SpaceVariantsRecord>(
    (accum, variantName, i) => {
      return Object.assign(accum, {
        [variantName]: calculateSpaceVariantAutoValue(i, baselineGrid, factor),
      });
    },
    {}
  );
  return transformedVariants;
}

export function calculateSpaceVariantsManual(
  variants: SpaceManual["variants"]
): SpaceVariantsRecord {
  return variants;
}

export function createSpaceVariants(
  size: ButteryTokensConfigSizeAndSpace
): SpaceVariantsRecord {
  switch (size.space.mode) {
    case "auto": {
      return calculateSpaceVariantsAuto(
        size.space.variants,
        size.baselineGrid,
        size.space.factor
      );
    }

    case "manual": {
      return calculateSpaceVariantsManual(size.space.variants);
    }

    default:
      return exhaustiveMatchGuard(size.space);
  }
}
