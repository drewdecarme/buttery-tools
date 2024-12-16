import { classes, useForwardedRef } from "@buttery/components";
import {
  makeColor,
  makeFontFamily,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type {
  ChangeEventHandler,
  FormEventHandler,
  JSX,
  RefCallback,
} from "react";
import { forwardRef, useCallback, useRef } from "react";

import { InputNumber } from "./InputNumber";

export type InputRangePropsNative = Omit<
  JSX.IntrinsicElements["input"],
  "type" | "min" | "max"
>;
export type InputRangePropsCustom = {
  min: number;
  max: number;
  dxDisplayMax?: boolean;
  dxDisplayMin?: boolean;
  dxDisplayInput?: boolean;
  dxDisplayTooltip?: boolean;
  dxVariant?: "normal" | "hue";
  /**
   * Custom handler that has the value of the range
   * passed as a parameter
   */
  dxOnChange?: (value: number) => void;
};
export type InputRangeProps = InputRangePropsNative & InputRangePropsCustom;

const containerStyles = css`
  display: flex;
  align-items: center;
  gap: ${makeRem(16)};
  width: 100%;
  font-family: ${makeFontFamily("body")};

  .label {
    font-size: ${makeRem(12)};
    color: ${makeColor("neutral", { opacity: 0.8 })};
  }

  .manual-input {
    width: ${makeRem(50)};
    text-align: center;
  }
`;

const inputStyles = css`
  --thumb-bg: white;
  --thumb-size: ${makeRem(14)};
  --thumb-border: ${makeRem(1)} solid
    ${makeColor("neutral-dark", { opacity: 0.2 })};
  --thumb-offset: calc(calc(var(--thumb-size) / 4) * -1);

  --track-height: calc(var(--thumb-size) / 2);
  &.v-normal {
    --track-bg: ${`linear-gradient(
    to right,
    ${makeColor("primary")} 0%, 
    ${makeColor("primary")} var(--percentage),
    ${makeColor("neutral-dark", { opacity: 0.02 })} var(--percentage),
    ${makeColor("neutral-dark", { opacity: 0.02 })} 100%)`};
  }

  &.v-hue {
    --track-bg: linear-gradient(
      to right,
      red,
      yellow,
      lime,
      cyan,
      blue,
      magenta,
      red
    );
  }

  --track-border-radius: ${makeRem(4)};

  --shadow-color: 0deg 0% 0%;
  --shadow-elevation-low: 0.3px 0.2px 0.4px hsl(var(--shadow-color) / 0.12),
    0.5px 0.4px 0.7px -1.2px hsl(var(--shadow-color) / 0.13),
    1.2px 0.9px 1.7px -2.3px hsl(var(--shadow-color) / 0.13);
  --shadow-elevation-medium: 0.3px 0.2px 0.4px hsl(var(--shadow-color) / 0.13),
    1px 0.7px 1.4px -0.8px hsl(var(--shadow-color) / 0.13),
    2.5px 1.9px 3.6px -1.6px hsl(var(--shadow-color) / 0.14),
    6px 4.5px 8.6px -2.3px hsl(var(--shadow-color) / 0.14);
  --shadow-elevation-high: 0.3px 0.2px 0.4px hsl(var(--shadow-color) / 0.14),
    2.2px 1.7px 3.2px -0.4px hsl(var(--shadow-color) / 0.14),
    4.4px 3.3px 6.3px -0.8px hsl(var(--shadow-color) / 0.14),
    7.7px 5.8px 11.1px -1.2px hsl(var(--shadow-color) / 0.14),
    13px 9.8px 18.7px -1.6px hsl(var(--shadow-color) / 0.15),
    21.2px 16px 30.5px -2px hsl(var(--shadow-color) / 0.15),
    33.3px 25.1px 47.9px -2.3px hsl(var(--shadow-color) / 0.15);

  width: 100%;
  box-shadow: none;

  ${makeReset("input")};

  &::-webkit-slider-runnable-track {
    height: var(--track-height);
    border-radius: var(--track-border-radius);
    background: var(--track-bg);
  }

  &::-moz-range-track {
    background: var(--track-bg);
    height: var(--track-height);
    background: var(--track-bg);
  }

  &::-ms-track {
    background: transparent;
    border-color: transparent;
    color: transparent;
    height: var(--track-height);
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background: var(--thumb-bg);
    border: var(--thumb-border);
    width: var(--thumb-size);
    height: var(--thumb-size);
    box-shadow: var(--shadow-elevation-low);
    border-radius: 50%;
    margin-top: var(--thumb-offset);
    cursor: pointer;
    transition: all 0.1s ease-in-out;

    &:hover {
      box-shadow: var(--shadow-elevation-medium);
      border-color: ${makeColor("primary-100")};
    }

    &:active {
      box-shadow: var(--shadow-elevation-high);
      border-color: ${makeColor("primary-100")};
    }
  }

  &::-moz-range-thumb {
    background: var(--thumb-bg);
    width: var(--thumb-size);
    height: var(--thumb-size);
    box-shadow: var(--shadow-elevation-low);
    border-radius: 50%;
    cursor: pointer;
  }

  &::-ms-thumb {
    background: var(--thumb-bg);
    width: var(--thumb-size);
    height: var(--thumb-size);
    box-shadow: var(--shadow-elevation-medium);
    border-radius: 50%;
    cursor: pointer;
  }

  &::-ms-fill-lower {
    background: var(--track-bg);
  }

  &::-ms-fill-upper {
    background: var(--track-bg);
  }

  &:focus {
    outline: none;
  }
`;

export const InputRange = forwardRef<HTMLInputElement, InputRangeProps>(
  function InputRange(
    {
      min,
      max,
      dxDisplayMin,
      dxDisplayMax,
      dxDisplayInput,
      dxDisplayTooltip,
      dxVariant = "normal",
      dxOnChange,
      className,
      ...restProps
    },
    forwardedRef
  ) {
    const ref = useForwardedRef(forwardedRef);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const setPercentage = useCallback<(node: HTMLInputElement) => void>(
      (node) => {
        const value = Number(node.value);
        const min = Number(node.min || 0);
        const max = Number(node.max || 100);
        const percentage = ((value - min) / (max - min)) * 100;

        node.style.setProperty(
          "--percentage",
          percentage.toString().concat("%")
        );
      },
      []
    );

    const handleInput = useCallback<FormEventHandler<HTMLInputElement>>(
      ({ currentTarget }) => {
        setPercentage(currentTarget);
        if (dxOnChange) dxOnChange(Number(currentTarget.value));
        // set the input value if it's available in the dom
        if (!inputRef.current) return;
        inputRef.current.value = currentTarget.value.toString();
      },
      [dxOnChange, setPercentage]
    );

    const inputRangeCallbackRef = useCallback<RefCallback<HTMLInputElement>>(
      (node) => {
        if (!node) return;
        setPercentage(node);
        if (dxOnChange) dxOnChange(Number(node.value));
        ref.current = node;
      },
      [dxOnChange, ref, setPercentage]
    );

    const inputNumberCallbackRef = useCallback<RefCallback<HTMLInputElement>>(
      (node) => {
        if (!node || !ref.current) return;
        inputRef.current = node;
        node.value = ref.current.value;
      },
      [ref]
    );

    const handleManualChange = useCallback<
      ChangeEventHandler<HTMLInputElement>
    >(
      ({ currentTarget: { value } }) => {
        if (!ref.current) return;
        ref.current.value = value;
        setPercentage(ref.current);
      },
      [ref, setPercentage]
    );

    return (
      <div className={classes(containerStyles)}>
        {dxDisplayMin && <span className="label">{min}</span>}
        <input
          {...restProps}
          min={min}
          max={max}
          type="range"
          className={classes(
            inputStyles,
            {
              [`v-${dxVariant}`]: dxVariant,
            },
            className
          )}
          onInput={handleInput}
          ref={inputRangeCallbackRef}
        />
        {dxDisplayMax && <span className="label">{max}</span>}
        {dxDisplayInput && (
          <InputNumber
            ref={inputNumberCallbackRef}
            dxSize="dense"
            min={min}
            max={max}
            className="manual-input"
            onChange={handleManualChange}
          />
        )}
      </div>
    );
  }
);
