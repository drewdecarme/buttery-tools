import type { ColorVariantTypeKeyValue } from "@buttery/tokens-utils/schemas";
import { useEffect } from "react";
import { generateGUID } from "@buttery/utils/isomorphic";
import { useImmer } from "use-immer";
import { css } from "@linaria/core";
import { makeRem } from "@buttery/tokens/playground";

import { ColorSwatchVariantAdd } from "./ColorSwatchVariantAdd";
import { ColorSwatchVariantRemove } from "./ColorSwatchVariantRemove";
import { ColorSwatchVariantList } from "./ColorSwatchVariantList";

import { InputLabel } from "../components/InputLabel";
import { InputText } from "../components/InputText";
import { InputColor } from "../components/InputColor";

export type ColorSwatchVariantTypeManualProps = {
  variants: ColorVariantTypeKeyValue;
  onChangeVariantManual: (variants: ColorVariantTypeKeyValue) => void;
};

const styles = css`
  grid-template-columns: ${makeRem(24)} 1fr auto !important;
`;

export function ColorSwatchVariantTypeManual({
  variants,
  onChangeVariantManual,
}: ColorSwatchVariantTypeManualProps) {
  const [localVariants, setLocalVariants] = useImmer<{
    [id: string]: { name: string; hex: string };
  }>(
    Object.entries(variants).reduce(
      (accum, [name, hex]) =>
        Object.assign(accum, {
          [generateGUID()]: {
            name,
            hex,
          },
        }),
      {}
    )
  );

  // Update the color config by transforming the local state
  // back into the state the state that is used for the rest of the
  // the configuration
  useEffect(() => {
    onChangeVariantManual(
      Object.values(localVariants).reduce(
        (accum, value) => Object.assign(accum, { [value.name]: value.hex }),
        {}
      )
    );
  }, [localVariants, onChangeVariantManual]);

  const localVariantEntries = Object.entries(localVariants);

  return (
    <>
      <InputLabel
        dxLabel="Manual Variants"
        dxSize="dense"
        dxHelp="Add custom variant colors & names"
      />
      <ColorSwatchVariantList>
        {localVariantEntries.map(([colorId, { name, hex }]) => {
          return (
            <li key={colorId} className={styles}>
              <InputColor
                value={hex}
                dxSize="dense"
                onChange={({ currentTarget: { value } }) => {
                  setLocalVariants((draft) => {
                    draft[colorId].hex = value;
                  });
                }}
              />
              <InputText
                dxSize="dense"
                value={name}
                onChange={({ currentTarget: { value } }) => {
                  setLocalVariants((draft) => {
                    draft[colorId].name = value;
                  });
                }}
              />
              <ColorSwatchVariantRemove
                dxIsVisible={localVariantEntries.length > 1}
                onClick={() => {
                  setLocalVariants((draft) => {
                    delete draft[colorId];
                  });
                }}
              />
            </li>
          );
        })}
        <li>
          <ColorSwatchVariantAdd
            onClick={() => {
              setLocalVariants((draft) => {
                draft[generateGUID()] = {
                  hex: "#000000",
                  name: `variant${localVariantEntries.length + 1}`,
                };
              });
            }}
          />
        </li>
      </ColorSwatchVariantList>
    </>
  );
}
