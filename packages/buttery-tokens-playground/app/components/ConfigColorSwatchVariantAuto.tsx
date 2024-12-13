import type {
  ButteryTokensColorVariant,
  ColorVariantTypeAuto,
} from "@buttery/tokens-utils/schemas";
import type { ChangeEvent } from "react";

import { InputLabel } from "./InputLabel";
import { InputNumber } from "./InputNumber";

export function ConfigColorSwatchVariantAuto({
  variant,
  onChangeVariantAuto,
}: {
  variant: ColorVariantTypeAuto;
  onChangeVariantAuto: (variant: ButteryTokensColorVariant) => void;
}) {
  function handleChangeVariantTypeAuto({
    currentTarget: { value },
  }: ChangeEvent<HTMLInputElement>): void {
    onChangeVariantAuto(Number(value));
  }

  return (
    <InputLabel dxLabel="Total # of variants" dxSize="dense">
      <InputNumber
        dxSize="dense"
        value={variant}
        onChange={handleChangeVariantTypeAuto}
      />
    </InputLabel>
  );
}
