import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { forwardRef } from "react";

import type { InputRangePropsNative } from "./InputRange";
import { InputRange } from "./InputRange";
import { ColorBlob, useColorBlob } from "./ColorBlob";

export type InputHuePropsNative = InputRangePropsNative & { value?: number };
export type InputHueProps = InputHuePropsNative;

const styles = css`
  display: grid;
  grid-template-columns: ${makeRem(24)} 1fr;
  gap: ${makeRem(16)};
  align-items: center;
  width: 100%;
`;

export const InputHue = forwardRef<HTMLInputElement, InputHueProps>(
  function InputHue({ children, className, value, ...restProps }, ref) {
    const { colorBlobRef, setHue } = useColorBlob();

    return (
      <div className={styles}>
        <ColorBlob
          ref={colorBlobRef}
          dxVariant="square"
          dxType="hue"
          dxValue={Number(value)}
        />
        <InputRange
          dxDisplayInput
          dxVariant="hue"
          min={0}
          max={360}
          ref={ref}
          dxOnChange={setHue}
          value={value}
          {...restProps}
        />
      </div>
    );
  }
);
