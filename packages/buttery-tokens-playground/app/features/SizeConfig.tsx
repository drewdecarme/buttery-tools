import type { ChangeEventHandler } from "react";
import { useCallback, useEffect } from "react";

import { InputGroup } from "~/components/InputGroup";
import { InputLabel } from "~/components/InputLabel";
import { InputNumber } from "~/components/InputNumber";

import { useConfigurationContext } from "./Config.context";
import { useRecalculateSpaceVariants } from "./space.useRecalculateSpaceVariants";

export function SizeConfig() {
  const { size, setSize } = useConfigurationContext();
  const { recalculateSpaceVariants } = useRecalculateSpaceVariants();

  const handleChangeDocumentFontSize = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      setSize((draft) => {
        draft.documentFontSize = Number(value);
      });
    },
    [setSize]
  );

  const handleChangeBaselineGrid = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      setSize((draft) => {
        draft.baselineGrid = Number(value);
      });
    },
    [setSize]
  );

  // recalculate the size variants when the baseline grid changes
  useEffect(() => {
    recalculateSpaceVariants();
  }, [recalculateSpaceVariants, size.baselineGrid]);

  return (
    <InputGroup>
      <InputLabel
        dxLabel="Document Font Size"
        dxHelp="Establishes a base for consistent layout and typography scaling."
        dxSize="dense"
      >
        <InputNumber
          dxSize="dense"
          defaultValue={size.documentFontSize}
          onChange={handleChangeDocumentFontSize}
        />
      </InputLabel>
      <InputLabel
        dxLabel="Baseline Grid"
        dxSize="dense"
        dxHelp="Harmonizes rhythm and alignment in layouts and typography. (factors of 2)"
      >
        <InputNumber
          dxSize="dense"
          step={2}
          defaultValue={size.baselineGrid}
          onChange={handleChangeBaselineGrid}
        />
      </InputLabel>
    </InputGroup>
  );
}
