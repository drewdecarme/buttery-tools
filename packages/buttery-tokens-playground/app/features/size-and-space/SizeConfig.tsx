import type { ChangeEventHandler } from "react";
import { useCallback, useEffect } from "react";
import { css } from "@linaria/core";
import { makeRem, makeReset } from "@buttery/tokens/playground";
import { exhaustiveMatchGuard } from "@buttery/utils/isomorphic";

import { InputGroup } from "~/components/InputGroup";
import { InputLabel } from "~/components/InputLabel";
import { InputNumber } from "~/components/InputNumber";

import { useRecalculateSpaceVariants } from "./space.useRecalculateSpaceVariants";
import type { SizeConfigVariantPropsCustom } from "./SizeConfigVariant";
import { SizeConfigVariant } from "./SizeConfigVariant";

import { useConfigurationContext } from "../Config.context";

const ulStyles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(8)};
`;

export function SizeConfig() {
  const { sizing, setSizing } = useConfigurationContext();
  const { recalculateSpaceVariants } = useRecalculateSpaceVariants();

  const handleChangeDocumentFontSize = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      setSizing((draft) => {
        draft.baseFontSize = Number(value);
      });
    },
    [setSizing]
  );

  const handleChangeBaselineGrid = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      setSizing((draft) => {
        const newBaselineGrid = Number(value);
        if (!newBaselineGrid) return; // return if the baseline grid is 0

        const mathFn =
          newBaselineGrid < draft.baselineGrid ? Math.floor : Math.ceil;
        draft.baselineGrid = newBaselineGrid;

        // Go through all of the size variants and adjust their values
        // to multiples of the `newBaselineGrid`
        const sizeVariantEntries = Object.entries(draft.size.variants);
        for (const [variantId, variant] of sizeVariantEntries) {
          const nearestValue =
            mathFn(variant.value / newBaselineGrid) * newBaselineGrid;
          draft.size.variants[variantId].value = nearestValue;
        }
      });
    },
    [setSizing]
  );

  // recalculate the size variants when the baseline grid changes
  useEffect(() => {
    recalculateSpaceVariants();
  }, [recalculateSpaceVariants, sizing.baselineGrid]);

  const handleChangeVariantProperties = useCallback<
    SizeConfigVariantPropsCustom["dxOnChangeVariantProperties"]
  >(
    (id, options) => {
      switch (options.property) {
        case "name":
          setSizing((draft) => {
            draft.size.variants[id].name = options.name;
          });
          break;

        case "value":
          setSizing((draft) => {
            draft.size.variants[id].value = options.value;
          });
          break;

        default:
          exhaustiveMatchGuard(options);
      }
    },
    [setSizing]
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
          value={sizing.baseFontSize}
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
          value={sizing.baselineGrid}
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
          {Object.entries(sizing.size.variants).map(
            ([variantId, { name, value }]) => (
              <li key={variantId}>
                <SizeConfigVariant
                  dxVariantId={variantId}
                  dxName={name}
                  dxValue={value}
                  dxBaselineGrid={sizing.baselineGrid}
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
