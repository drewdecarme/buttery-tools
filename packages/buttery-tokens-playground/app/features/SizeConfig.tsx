import type { ChangeEventHandler } from "react";
import { useCallback, useEffect } from "react";

import { InputGroup } from "~/components/InputGroup";
import { InputLabel } from "~/components/InputLabel";
import { InputNumber } from "~/components/InputNumber";

import { useConfigurationContext } from "./Config.context";
import { useRecalculateSpaceVariants } from "./space.useRecalculateSpaceVariants";

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
        draft.baselineGrid = Number(value);
      });
    },
    [setSizeAndSpace]
  );

  // recalculate the size variants when the baseline grid changes
  useEffect(() => {
    recalculateSpaceVariants();
  }, [recalculateSpaceVariants, sizeAndSpace.baselineGrid]);

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
      <InputLabel
        dxLabel="Variants (WIP)"
        dxSize="dense"
        dxHelp="Create named variants to align the vertical sizing of adjacent elements"
      >
        <InputNumber
          dxSize="dense"
          step={2}
          defaultValue={sizeAndSpace.baselineGrid}
          onChange={handleChangeBaselineGrid}
        />
      </InputLabel>
    </InputGroup>
  );
}
