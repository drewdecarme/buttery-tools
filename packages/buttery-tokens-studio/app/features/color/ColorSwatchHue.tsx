import type { ChangeEventHandler } from "react";

import { InputLabel } from "~/components/InputLabel";
import { InputHue } from "~/components/InputHue";

export function ColorSwatchHue(props: {
  hue: number;
  onChangeHue: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <InputLabel
      dxLabel="Hue"
      dxHelp="The position of the color on the visible spectrum"
      dxSize="dense"
    >
      <InputHue value={props.hue} onChange={props.onChangeHue} />
    </InputLabel>
  );
}
