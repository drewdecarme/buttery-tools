import type { ColorVariantTypeNamed } from "@buttery/tokens-utils/schemas";

import { InputLabel } from "./InputLabel";
import { InputText } from "./InputText";
import { ColorSwatchVariantAdd } from "./ColorSwatchVariantAdd";
import { ColorSwatchVariantRemove } from "./ColorSwatchVariantRemove";
import { ColorSwatchVariantList } from "./ColorSwatchVariantList";

export type ColorSwatchVariantTypeNamedProps = {
  variants: ColorVariantTypeNamed;
  onChangeVariantNamed: (
    params:
      | { mode: "change"; index: number; value: string }
      | { mode: "add"; newValue: string }
      | { mode: "remove"; index: number }
  ) => void;
};

export function ColorSwatchVariantTypeNamed({
  variants,
  onChangeVariantNamed,
}: ColorSwatchVariantTypeNamedProps) {
  function addVariant() {
    onChangeVariantNamed({
      mode: "add",
      newValue: `variant-${variants.length + 1}`,
    });
  }

  return (
    <>
      <InputLabel dxLabel="Named Variants" dxSize="dense" />
      <ColorSwatchVariantList>
        {variants.map((v, index) => {
          return (
            <li key={String(index)}>
              <InputText
                dxSize="dense"
                value={v}
                onChange={({ currentTarget: { value } }) => {
                  onChangeVariantNamed({ mode: "change", index, value });
                }}
              />
              <ColorSwatchVariantRemove
                dxIsVisible={variants.length !== 1}
                onClick={() => {
                  onChangeVariantNamed({ mode: "remove", index });
                }}
              />
            </li>
          );
        })}
        <li>
          <ColorSwatchVariantAdd onClick={addVariant} />
        </li>
      </ColorSwatchVariantList>
    </>
  );
}
