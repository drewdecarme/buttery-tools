import { useCallback } from "react";
import { calculateSpaceVariantAutoValue } from "@buttery/tokens-utils";
import { exhaustiveMatchGuard, generateGUID } from "@buttery/utils/isomorphic";

import { useConfigurationContext } from "./Config.context";

export function useRecalculateSpaceVariants() {
  const {
    setSizeAndSpace,
    sizeAndSpace: {
      space: { mode },
    },
  } = useConfigurationContext();

  const recalculateSpaceVariants = useCallback<
    (numOfVariants?: number) => void
  >(
    (numOfVariants) => {
      setSizeAndSpace((draft) => {
        const prevVariants = draft.space[mode].variants;
        const prevVarEntries = Object.entries(prevVariants);
        const prevVarEntriesLength = prevVarEntries.length;
        const prevVarLastEntryVal = prevVarEntries[prevVarEntriesLength - 1][1];

        const totalVariants = numOfVariants ?? prevVarEntriesLength;

        // Remove the amount of values
        if (totalVariants < prevVarEntriesLength) {
          // Remove the amount of values
          const newEntries = prevVarEntries.slice(0, totalVariants);
          draft.space[mode].variants = Object.fromEntries(newEntries);
          return;
        }

        // Add the amount of values
        if (totalVariants > prevVarEntriesLength) {
          const numOfVariantsToAdd = totalVariants - prevVarEntriesLength;
          const newVariantsArr = [...new Array(numOfVariantsToAdd)];
          const newVariantStartIndex = prevVarEntriesLength + 1;
          const newVariantStartOrder = prevVarLastEntryVal.order + 1;

          switch (mode) {
            case "auto": {
              const newAutoVariants = Object.entries(newVariantsArr).reduce(
                (accum, _, i) => {
                  const index = newVariantStartIndex + i;
                  const order = newVariantStartOrder + i;
                  const value = calculateSpaceVariantAutoValue(
                    index,
                    draft.baselineGrid,
                    draft.space.auto.factor
                  );

                  return Object.assign(accum, {
                    [generateGUID()]: {
                      name: String(index),
                      value,
                      order,
                    },
                  });
                },
                prevVariants
              );
              draft.space[mode].variants = newAutoVariants;
              return;
            }

            case "manual": {
              const newManualVariants = Object.entries(newVariantsArr).reduce(
                (accum, _, i) => {
                  const index = newVariantStartIndex + i;
                  const order = newVariantStartOrder + i;
                  const value = index * draft.baselineGrid;

                  return Object.assign(accum, {
                    [generateGUID()]: {
                      name: String(index),
                      value,
                      order,
                    },
                  });
                },
                prevVariants
              );
              draft.space[mode].variants = newManualVariants;
              return;
            }

            default:
              exhaustiveMatchGuard(mode);
          }
        }

        // Do this when the previous number of variants are teh same
        // as the requested amount of variants
        const updatedVariants = Object.entries(prevVariants).map(
          ([variantId, variantValue], index) => {
            const value =
              mode === "auto"
                ? calculateSpaceVariantAutoValue(
                    index,
                    draft.baselineGrid,
                    draft.space.auto.factor
                  )
                : variantValue.value;

            return [
              variantId,
              {
                ...variantValue,
                name: String(index),
                value,
              },
            ];
          }
        );
        draft.space[mode].variants = Object.fromEntries(updatedVariants);
      });
    },
    [mode, setSizeAndSpace]
  );

  return { recalculateSpaceVariants };
}
