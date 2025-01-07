import { css } from "@linaria/core";
import { makeColor, makeRem, makeReset } from "@buttery/tokens/playground";
import type { ChangeEventHandler, FormEventHandler, RefCallback } from "react";
import { useCallback, useMemo, useRef } from "react";
import { classes, exhaustiveMatchGuard, useToggle } from "@buttery/components";
import { debounce } from "@buttery/utils/browser";
import { generateGUID } from "@buttery/utils/isomorphic";
import { calculateSpaceVariantAutoValue } from "@buttery/tokens-utils";

import { Button } from "~/components/Button";
import { IconPencilEdit01 } from "~/icons/IconPencilEdit01";
import { IconTick01 } from "~/icons/IconTick01";
import { InputText } from "~/components/InputText";
import { InputLabel } from "~/components/InputLabel";
import type { InputRangePropsCustom } from "~/components/InputRange";
import { InputRange } from "~/components/InputRange";

import {
  orderSpaceVariants,
  type ConfigurationStateSize,
  type ConfigurationStateSizeSpaceVariants,
} from "./config.utils";
import type { ConfigurationContextType } from "./Config.context";

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(8)};

  form {
    display: grid;
    grid-template-columns: 1fr ${makeRem(54)} ${makeRem(54)} auto;
    gap: ${makeRem(16)};
    height: ${makeRem(44)};
    background: white;
    align-items: center;
    padding: 0 ${makeRem(16)};
    font-size: ${makeRem(14)};
    border-radius: ${makeRem(4)};

    .stat {
      justify-self: start;
      display: flex;
      gap: ${makeRem(8)};
      font-size: ${makeRem(14)};
      color: ${makeColor("neutral-light", { opacity: 0.5 })};

      span.txt {
        min-width: ${makeRem(36)};
      }
    }

    .actions {
      justify-self: end;
      font-size: ${makeRem(14)};
    }

    .save {
      color: ${makeColor("success-500")};
    }
  }
`;
export type SpaceConfigVariantItemProps = {
  baseFontSize: number;
  onChangeVariantName: (id: string, name: string) => void;
  onChangeVariantValue?: (id: string, value: string) => void;
};

function SpaceConfigVariantItem({
  id,
  name,
  value,
  baseFontSize,
  onChangeVariantName,
  onChangeVariantValue,
}: SpaceConfigVariantItemProps & { id: string; name: string; value: number }) {
  const [isEditing, toggle] = useToggle(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleChangeVariantName = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      onChangeVariantName(id, value);
    },
    [id, onChangeVariantName]
  );

  const handleChangeVariantValue = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      if (!onChangeVariantValue) return;
      onChangeVariantValue(id, value);
    },
    [id, onChangeVariantValue]
  );

  const inputRef = useCallback<RefCallback<HTMLInputElement>>((node) => {
    if (!node) return;
    node.select();
  }, []);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      toggle();
      if (!buttonRef.current) return;
      buttonRef.current.focus();
    },
    [toggle]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {isEditing ? (
          <InputText
            ref={inputRef}
            defaultValue={name}
            dxSize="dense"
            dxType="text"
            onChange={handleChangeVariantName}
          />
        ) : (
          name
        )}
      </div>
      {onChangeVariantValue && (
        <div>
          {isEditing ? (
            <InputText
              defaultValue={value}
              dxSize="dense"
              dxType="text"
              onChange={handleChangeVariantValue}
            />
          ) : (
            value
          )}
        </div>
      )}
      {!onChangeVariantValue && <div className="stat">{`${value}px`}</div>}
      <div className="stat">{`${value / baseFontSize}rem`}</div>
      <div className="actions">
        <Button
          ref={buttonRef}
          type="button"
          dxVariant="icon"
          dxSize="dense"
          dxStyle="normal"
          DXIcon={isEditing ? IconTick01 : IconPencilEdit01}
          dxHelp={isEditing ? "Save name" : "Edit name"}
          className={classes({ save: isEditing })}
          onClick={toggle}
        />
      </div>
    </form>
  );
}

export function SpaceConfigVariants({
  variants,
  mode,
  baseFontSize,
  setSize,
}: {
  baseFontSize: number;
  variants: ConfigurationStateSizeSpaceVariants;
  mode: ConfigurationStateSize["mode"];
  setSize: ConfigurationContextType["setSize"];
}) {
  const handleChangeNumOfVariants = useCallback<
    Required<InputRangePropsCustom>["dxOnChange"]
  >(
    (value) => {
      setSize((draft) => {
        const prevVariants = draft[mode].variants;
        const prevVarEntries = Object.entries(draft[mode].variants);
        const prevVarEntriesLength = prevVarEntries.length;
        const prevVarLastEntryVal = prevVarEntries[prevVarEntriesLength - 1][1];

        // Remove the amount of values
        if (value < prevVarEntriesLength) {
          const newEntries = prevVarEntries.slice(0, value);
          draft[mode].variants = Object.fromEntries(newEntries);
          return;
        }

        // Add the amount of values
        if (value > prevVarEntriesLength) {
          const numOfVariantsToAdd = value - prevVarEntriesLength;
          const newVariantsArr = [...new Array(numOfVariantsToAdd)];
          const newVariantStartIndex = prevVarEntriesLength + 1;
          const newVariantStartOrder = prevVarLastEntryVal.order + 1;

          switch (mode) {
            case "auto": {
              draft.auto.variants = Object.entries(newVariantsArr).reduce(
                (accum, _, i) => {
                  const index = newVariantStartIndex + i;
                  const order = newVariantStartOrder + i;
                  const value = calculateSpaceVariantAutoValue(
                    index,
                    draft.baselineGrid,
                    draft.auto.factor
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
              break;
            }

            case "manual": {
              draft.manual.variants = Object.entries(newVariantsArr).reduce(
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
              break;
            }

            default:
              exhaustiveMatchGuard(mode);
          }
        }
      });
    },
    [mode, setSize]
  );

  const debouncedHandleChangeNumOfVariants = useMemo(
    () => debounce(handleChangeNumOfVariants, 100),
    [handleChangeNumOfVariants]
  );

  const handleChangeVariantName = useCallback<
    SpaceConfigVariantItemProps["onChangeVariantName"]
  >(
    (id, name) => {
      setSize((draft) => {
        draft[mode].variants[id].name = name;
      });
    },
    [mode, setSize]
  );

  const orderedVariants = orderSpaceVariants(variants);

  return (
    <>
      <InputLabel
        dxLabel="Variants"
        dxHelp="The number of spacing variants (default: 5)"
        dxSize="dense"
      >
        <div>
          <InputRange
            defaultValue={Object.entries(variants).length}
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
      <ul className={styles}>
        {Object.entries(orderedVariants).map(([variantId, { name, value }]) => {
          return (
            <li key={variantId}>
              <SpaceConfigVariantItem
                id={variantId}
                name={name}
                value={value}
                baseFontSize={baseFontSize}
                onChangeVariantName={handleChangeVariantName}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}
