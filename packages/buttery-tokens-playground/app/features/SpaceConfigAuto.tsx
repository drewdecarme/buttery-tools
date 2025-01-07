import type { ChangeEventHandler } from "react";
import { useCallback } from "react";
import { css } from "@linaria/core";
import { makeRem } from "@buttery/tokens/playground";
import { calculateSpaceVariantAutoValue } from "@buttery/tokens-utils";

import { InputGroup } from "~/components/InputGroup";
import { InputLabel } from "~/components/InputLabel";
import { InputCheckbox } from "~/components/InputCheckbox";
import { InputSelect } from "~/components/InputSelect";

import { type ConfigurationStateSizeAuto } from "./config.utils";
import type { ConfigurationContextType } from "./Config.context";
import { SpaceConfigVariants } from "./SpaceConfigVariants";

const labelStyles = css`
  display: grid;
  grid-template-columns: auto 1fr;
  width: 100%;
  align-items: center;
  gap: ${makeRem(8)};

  & > div.input-select {
    width: 50%;
  }
`;

export function SpaceConfigAuto({
  baseFontSize,
  state,
  setSize,
}: {
  baseFontSize: number;
  state: ConfigurationStateSizeAuto;
  setSize: ConfigurationContextType["setSize"];
}) {
  const handleUpdateVariantsWithFactor = useCallback<
    (value: 2 | 3 | undefined) => void
  >(
    (factor) => {
      setSize((draft) => {
        draft.auto.factor = factor;

        const updatedEntries = Object.entries(draft.auto.variants).map(
          ([variantId, variantValue], index) => [
            variantId,
            {
              ...variantValue,
              value: calculateSpaceVariantAutoValue(
                index,
                draft.baselineGrid,
                factor
              ),
            },
          ]
        );
        draft.auto.variants = Object.fromEntries(updatedEntries);
      });
    },
    [setSize]
  );

  const handleToggleFactor = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget: { checked } }) => {
      handleUpdateVariantsWithFactor(checked ? 2 : undefined);
    },
    [handleUpdateVariantsWithFactor]
  );

  const handleSetFactor = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    ({ currentTarget: { value } }) => {
      handleUpdateVariantsWithFactor(Number(value) as 2 | 3);
    },
    [handleUpdateVariantsWithFactor]
  );

  return (
    <InputGroup>
      <InputLabel
        dxLabel="Use a scaling factor?"
        dxHelp="Scales the variants using a factor instead incrementing linearly"
        dxSize="dense"
      >
        <div className={labelStyles}>
          <InputCheckbox
            defaultChecked={!!state.factor}
            onChange={handleToggleFactor}
          />
          <InputSelect
            dxSize="dense"
            defaultValue={state.factor}
            disabled={!state.factor}
            onChange={handleSetFactor}
          >
            <option value="2">2</option>
            <option value="3">3</option>
          </InputSelect>
        </div>
      </InputLabel>
      <SpaceConfigVariants
        mode="auto"
        setSize={setSize}
        variants={state.variants}
        baseFontSize={baseFontSize}
      />
    </InputGroup>
  );
}
