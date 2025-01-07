import type { ChangeEventHandler } from "react";
import { useCallback, useMemo } from "react";
import { debounce } from "@buttery/utils/browser";
import { css } from "@linaria/core";
import { makeRem } from "@buttery/tokens/playground";

import { InputGroup } from "~/components/InputGroup";
import { InputLabel } from "~/components/InputLabel";
import type { InputRangePropsCustom } from "~/components/InputRange";
import { InputRange } from "~/components/InputRange";
import { InputCheckbox } from "~/components/InputCheckbox";
import { InputSelect } from "~/components/InputSelect";

import {
  formatSpaceAutoVariants,
  type ConfigurationStateSizeAuto,
} from "./config.utils";
import type { ConfigurationContextType } from "./Config.context";
import type { SpaceConfigVariantItemProps } from "./SpaceConfigVariants";
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
  const handleChangeNumOfVariants = useCallback<
    Required<InputRangePropsCustom>["dxOnChange"]
  >(
    (value) => {
      setSize((draft) => {
        const prevVariants = draft.auto.variants;
        const prevEntries = Object.entries(prevVariants);
        const prevLength = prevEntries.length;

        if (value === prevLength) return;

        if (value < prevLength) {
          const newEntries = prevEntries.slice(0, value);
          draft.auto.variants = Object.fromEntries(newEntries);
        }
        if (value > prevLength) {
          const prevNames = prevEntries.map(([_, entry]) => entry.name);
          const numToAdd = value - prevLength;
          const newNames = prevNames
            .concat([...new Array(numToAdd)])
            .map((name, i) => {
              if (!name) return i.toString();
              return name;
            });

          const newVariants = formatSpaceAutoVariants(
            newNames,
            draft.baselineGrid,
            draft.auto.factor
          );
          draft.auto.variants = newVariants;
        }
      });
    },
    [setSize]
  );

  const debouncedHandleChangeNumOfVariants = useMemo(
    () => debounce(handleChangeNumOfVariants, 100),
    [handleChangeNumOfVariants]
  );

  const handleUpdateVariantsWithFactor = useCallback<
    (value: 2 | 3 | undefined) => void
  >(
    (factor) => {
      setSize((draft) => {
        const prevVariantNames = Object.entries(draft.auto.variants).map(
          ([_, entry]) => entry.name
        );
        const newVariants = formatSpaceAutoVariants(
          prevVariantNames,
          draft.baselineGrid,
          factor
        );
        draft.auto.factor = factor;
        draft.auto.variants = newVariants;
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

  const handleChangeVariantName = useCallback<
    SpaceConfigVariantItemProps["onChangeVariantName"]
  >(
    (id, name) => {
      setSize((draft) => {
        draft.auto.variants[id].name = name;
      });
    },
    [setSize]
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
      <InputLabel
        dxLabel="Variants"
        dxHelp="The number of spacing variants (default: 5)"
        dxSize="dense"
      >
        <div>
          <InputRange
            defaultValue={Object.entries(state.variants).length}
            dxDisplayInput
            dxDisplayMax
            dxDisplayMin
            min={1}
            max={50}
            step={1}
            dxVariant="normal"
            dxOnChange={debouncedHandleChangeNumOfVariants}
          />
        </div>
      </InputLabel>
      <SpaceConfigVariants
        variants={state.variants}
        baseFontSize={baseFontSize}
        onChangeVariantName={handleChangeVariantName}
      />
    </InputGroup>
  );
}
