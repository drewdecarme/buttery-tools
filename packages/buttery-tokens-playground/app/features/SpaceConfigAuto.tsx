import { useCallback, useMemo } from "react";
import { debounce } from "@buttery/utils/browser";

import { InputGroup } from "~/components/InputGroup";
import { InputLabel } from "~/components/InputLabel";
import { InputNumber } from "~/components/InputNumber";
import type { InputRangePropsCustom } from "~/components/InputRange";
import { InputRange } from "~/components/InputRange";

import {
  formatSpaceAutoVariants,
  type ConfigurationStateSizeAuto,
} from "./config.utils";
import type { ConfigurationContextType } from "./Config.context";
import { SpaceConfigVariants } from "./SpaceConfigVariants";

export function SpaceConfigAuto({
  baseFontSize,
  state,
  setSize,
}: {
  baseFontSize: number;
  state: ConfigurationStateSizeAuto;
  setSize: ConfigurationContextType["setSize"];
}) {
  const handleOnChange = useCallback<
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

  const debounceOnChange = useMemo(
    () => debounce(handleOnChange, 100),
    [handleOnChange]
  );

  return (
    <InputGroup>
      <InputLabel
        dxLabel="Scaling factor"
        dxHelp="Multiplies the baseline grid to define scalable spacing intervals"
        dxSize="dense"
      >
        <InputNumber dxSize="dense" defaultValue={state.factor} />
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
            dxOnChange={debounceOnChange}
          />
        </div>
      </InputLabel>
      <SpaceConfigVariants
        variants={state.variants}
        baseFontSize={baseFontSize}
      />
    </InputGroup>
  );
}
