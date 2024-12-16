import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { forwardRef, useCallback, useRef } from "react";

import type {
  InputRangePropsCustom,
  InputRangePropsNative,
} from "./InputRange";
import { InputRange } from "./InputRange";

export type InputHuePropsNative = InputRangePropsNative;
export type InputHueProps = InputHuePropsNative;

const styles = css`
  display: grid;
  grid-template-columns: ${makeRem(24)} 1fr;
  gap: ${makeRem(8)};
  align-items: center;
  width: 100%;

  .color {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: ${makeRem(4)};
    background: hsl(var(--hue), 100%, 50%);
  }
`;

export const InputHue = forwardRef<HTMLInputElement, InputHueProps>(
  function InputHue({ children, className, ...restProps }, ref) {
    const colorRef = useRef<HTMLDivElement | null>(null);

    const handleChange = useCallback<
      Required<InputRangePropsCustom>["dxOnChange"]
    >((value) => {
      if (!colorRef.current) return;
      colorRef.current.style.setProperty("--hue", value.toString());
    }, []);

    return (
      <div className={styles}>
        <div className="color" ref={colorRef} />
        <InputRange
          dxDisplayInput
          dxVariant="hue"
          min={0}
          max={360}
          ref={ref}
          dxOnChange={handleChange}
          {...restProps}
        />
      </div>
    );
  }
);
