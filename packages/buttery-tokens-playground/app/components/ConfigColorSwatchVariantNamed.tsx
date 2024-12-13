import type { ColorVariantTypeNamed } from "@buttery/tokens-utils/schemas";
import type { FC } from "react";
import { css } from "@linaria/core";
import { makeColor, makeRem, makeReset } from "@buttery/tokens/playground";
import { memo } from "react";

import { IconDelete } from "~/icons/IconDelete";

import { InputLabel } from "./InputLabel";
import { InputText } from "./InputText";

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(4)};

  li {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: ${makeRem(8)};
    align-items: center;
  }
`;

const removeStyles = css`
  ${makeReset("button")};
  width: ${makeRem(24)};
  aspect-ratio: 1 / 1;
`;

const addStyles = css`
  ${makeReset("button")};
  font-size: ${makeRem(12)};
  color: ${makeColor("secondary-700")};
  text-align: left;
`;

export type ConfigColorSwatchVariantNamedProps = {
  variants: ColorVariantTypeNamed;
  onChangeVariantNamed: (
    params:
      | { mode: "change"; index: number; value: string }
      | { mode: "add"; newValue: string }
      | { mode: "remove"; index: number }
  ) => void;
};

const VariantInput: FC<
  Pick<ConfigColorSwatchVariantNamedProps, "onChangeVariantNamed"> & {
    value: string;
    index: number;
    isRemoveVisible: boolean;
  }
> = memo(function VariantInput({
  onChangeVariantNamed,
  value,
  index,
  isRemoveVisible,
}) {
  return (
    <>
      <InputText
        dxSize="dense"
        value={value}
        onChange={({ currentTarget: { value } }) => {
          onChangeVariantNamed({ mode: "change", index, value });
        }}
      />
      {isRemoveVisible ? (
        <button
          className={removeStyles}
          onClick={() => {
            onChangeVariantNamed({ mode: "remove", index });
          }}
        >
          <IconDelete dxSize={12} />
        </button>
      ) : (
        <div />
      )}
    </>
  );
});

export function ConfigColorSwatchVariantNamed({
  variants,
  onChangeVariantNamed,
}: ConfigColorSwatchVariantNamedProps) {
  function addVariant() {
    onChangeVariantNamed({
      mode: "add",
      newValue: `variant-${variants.length + 1}`,
    });
  }

  return (
    <>
      <InputLabel dxLabel="Named Variants" dxSize="dense" />
      <ul className={styles}>
        {variants.map((v, i) => {
          const key = String(i);
          return (
            <li key={key}>
              <VariantInput
                value={v}
                index={i}
                onChangeVariantNamed={onChangeVariantNamed}
                isRemoveVisible={variants.length !== 1}
              />
            </li>
          );
        })}
        <li>
          <button className={addStyles} onClick={addVariant} type="button">
            Add variant
          </button>
        </li>
      </ul>
    </>
  );
}
