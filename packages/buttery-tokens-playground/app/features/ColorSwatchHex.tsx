import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { ChangeEventHandler } from "react";

import { InputColor } from "../components/InputColor";

const styles = css`
  display: grid;
  grid-template-columns: ${makeRem(24)} 1fr;
  align-items: center;
  gap: ${makeRem(8)};
`;

export function ColorSwatchHex(props: {
  id: string;
  hex: string;
  onChangeHex: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className={styles}>
      <InputColor
        dxSize="dense"
        value={props.hex}
        onChange={props.onChangeHex}
      />
    </div>
  );
}
