import { makeColor, makeRem, makeReset } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { ChangeEventHandler } from "react";

const styles = css`
  display: grid;
  grid-template-columns: ${makeRem(24)} 1fr 2fr;
  align-items: center;
  gap: ${makeRem(8)};

  input {
    ${makeReset("input")};

    &[type="text"] {
      height: ${makeRem(24)};
      font-size: ${makeRem(12)};
      border: ${makeRem(1)} solid ${makeColor("neutral", { opacity: 0.1 })};
      border-radius: ${makeRem(2)};
      padding: 0 ${makeRem(8)};
      transition: all 0.1s ease-in-out;

      &:focus {
        border-color: ${makeColor("primary-100")};
      }
    }

    &[type="color"] {
      border-radius: ${makeRem(2)};
      height: 90%;
      aspect-ratio: 1 / 1;

      /* Add custom styling for the color picker circle */
      &::-webkit-color-swatch-wrapper {
        padding: 0;
      }

      &::-webkit-color-swatch {
        border: none;
      }

      /* Adjustments for non-Webkit browsers */
      &::-moz-color-swatch {
        border: none;
      }
    }
  }
`;

export function ConfigColorSwatchHex(props: {
  id: string;
  hex: string;
  name: string;
  onChangeHex: ChangeEventHandler<HTMLInputElement>;
  onChangeName: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className={styles}>
      <input type="color" value={props.hex} onChange={props.onChangeHex} />
      <input type="text" value={props.hex} onChange={props.onChangeHex} />
      <input type="text" value={props.name} onChange={props.onChangeName} />
    </div>
  );
}
