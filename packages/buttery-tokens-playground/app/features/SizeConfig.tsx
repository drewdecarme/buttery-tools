import type { ChangeEventHandler } from "react";
import { useCallback, useEffect } from "react";
import { css } from "@linaria/core";
import { makeRem, makeReset } from "@buttery/tokens/playground";
import { exhaustiveMatchGuard } from "@buttery/utils/isomorphic";

import { InputGroup } from "~/components/InputGroup";
import { InputLabel } from "~/components/InputLabel";
import { InputNumber } from "~/components/InputNumber";

import { useConfigurationContext } from "./Config.context";
import { useRecalculateSpaceVariants } from "./space.useRecalculateSpaceVariants";
import type { SizeConfigVariantPropsCustom } from "./SizeConfigVariant";
import { SizeConfigVariant } from "./SizeConfigVariant";

const ulStyles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(8)};
`;

export function SizeConfig() {
  const { sizeAndSpace, setSizeAndSpace } = useConfigurationContext();
  const { recalculateSpaceVariants } = useRecalculateSpaceVariants();

  const handleChangeDocumentFontSize = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      setSizeAndSpace((draft) => {
        draft.baseFontSize = Number(value);
      });
    },
    [setSizeAndSpace]
  );

  const handleChangeBaselineGrid = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      setSizeAndSpace((draft) => {
        const newBaselineGrid = Number(value);
        if (!newBaselineGrid) return; // return if the baseline grid is 0

        const mathFn =
          newBaselineGrid < draft.baselineGrid ? Math.floor : Math.ceil;
        draft.baselineGrid = newBaselineGrid;

        // Go through all of the size variants and adjust their values
        // to multiples of the newBaselineGrid
        const sizeVariantEntries = Object.entries(draft.size.variants);
        for (const [variantId, variant] of sizeVariantEntries) {
          const nearestValue =
            mathFn(variant.value / newBaselineGrid) * newBaselineGrid;
          console.log(draft.size.variants[variantId].value, nearestValue);
          draft.size.variants[variantId].value = nearestValue;
        }
      });
    },
    [setSizeAndSpace]
  );

  // recalculate the size variants when the baseline grid changes
  useEffect(() => {
    recalculateSpaceVariants();
  }, [recalculateSpaceVariants, sizeAndSpace.baselineGrid]);

  const handleChangeVariantProperties = useCallback<
    SizeConfigVariantPropsCustom["dxOnChangeVariantProperties"]
  >(
    (id, options) => {
      switch (options.property) {
        case "name":
          setSizeAndSpace((draft) => {
            draft.size.variants[id].name = options.name;
          });
          break;

        case "value":
          setSizeAndSpace((draft) => {
            draft.size.variants[id].value = options.value;
          });
          break;

        default:
          exhaustiveMatchGuard(options);
      }
    },
    [setSizeAndSpace]
  );

  return (
    <InputGroup>
      <InputLabel
        dxLabel="Document Font Size"
        dxHelp="Establishes a base for consistent layout and typography scaling."
        dxSize="dense"
      >
        <InputNumber
          dxSize="dense"
          defaultValue={sizeAndSpace.baseFontSize}
          onChange={handleChangeDocumentFontSize}
        />
      </InputLabel>
      <InputLabel
        dxLabel="Baseline Grid"
        dxSize="dense"
        dxHelp="Harmonizes rhythm and alignment in layouts and typography. (factors of 4)"
      >
        <InputNumber
          dxSize="dense"
          step={4}
          defaultValue={sizeAndSpace.baselineGrid}
          onChange={handleChangeBaselineGrid}
        />
      </InputLabel>
      <div>
        <InputLabel
          dxLabel="Variants"
          dxSize="dense"
          dxHelp="Create named variants to align the vertical sizing of adjacent elements such as inputs, buttons and icons"
        />
        <ul className={ulStyles}>
          {Object.entries(sizeAndSpace.size.variants).map(
            ([variantId, { name, value }]) => (
              <li key={variantId}>
                <SizeConfigVariant
                  dxVariantId={variantId}
                  dxName={name}
                  dxValue={value}
                  dxBaselineGrid={sizeAndSpace.baselineGrid}
                  dxOnChangeVariantProperties={handleChangeVariantProperties}
                />
              </li>
            )
          )}
        </ul>
      </div>
    </InputGroup>
  );
}
