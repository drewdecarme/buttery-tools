import { makeColor, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { ChangeEventHandler } from "react";

import { InputText } from "../components/InputText";
import { InputHue } from "../components/InputHue";

const styles = css`
  display: grid;
  grid-template-columns: 3fr auto ${makeRem(100)};
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
      <InputHue value={props.hue} onChange={props.onChangeHue} />
      <div className="bar" />
      <InputText
        dxSize="dense"
        value={props.name}
        onChange={props.onChangeName}
      />
    </div>
  );
}
