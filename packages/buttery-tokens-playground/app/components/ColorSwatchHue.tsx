import { makeColor, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { ChangeEventHandler } from "react";

import { InputText } from "./InputText";
import { InputRange } from "./InputRange";

const styles = css`
  display: grid;
  grid-template-columns: ${makeRem(24)} 3fr auto ${makeRem(100)};
  align-items: center;
  gap: ${makeRem(8)};

  .bar {
    width: ${makeRem(1)};
    margin: 0 ${makeRem(8)};
    height: 100%;
    background: ${makeColor("neutral-light", { opacity: 0.1 })};
  }
`;

export function ColorSwatchHue(props: {
  id: string;
  hue: number;
  name: string;
  onChangeHue: ChangeEventHandler<HTMLInputElement>;
  onChangeName: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className={styles}>
      <div />
      <InputRange
        dxDisplayInput
        value={props.hue}
        min={0}
        max={360}
        onChange={props.onChangeHue}
      />
      <div className="bar" />
      <InputText
        dxSize="dense"
        value={props.name}
        onChange={props.onChangeName}
      />
    </div>
  );
}
