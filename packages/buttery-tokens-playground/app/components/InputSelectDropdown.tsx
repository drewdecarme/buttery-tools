import type { DropdownOptions } from "@buttery/components";
import {
  classes,
  InputTextDropdown,
  useInputTextDropdown,
} from "@buttery/components";
import { css } from "@linaria/core";
import { useCallback, type JSX, type ReactNode } from "react";

import { InputSelectDropdownProvider } from "./InputSelectDropdown.context";

export type InputSelectDropdownPropsNative = JSX.IntrinsicElements["input"];
export type InputSelectDropdownPropsCustom = DropdownOptions & {
  dxOnSelect?: (value: string) => void;
  children: ReactNode;
};
export type InputSelectDropdownProps = InputSelectDropdownPropsNative &
  InputSelectDropdownPropsCustom;

const styles = css``;

export function InputSelectDropdown({
  className,
  children,
  dxOnSelect,
  ...restProps
}: InputSelectDropdownProps) {
  const { ref, setValue, closeDropdown } = useInputTextDropdown();

  const handleSelect = useCallback<(value: string) => void>(
    (value) => {
      setValue(value);
      if (dxOnSelect) dxOnSelect(value);
      closeDropdown();
    },
    [closeDropdown, dxOnSelect, setValue]
  );

  return (
    <InputTextDropdown
      {...restProps}
      readOnly
      className={classes(styles, className)}
      ref={ref}
    >
      <InputSelectDropdownProvider onSelect={handleSelect}>
        {children}
      </InputSelectDropdownProvider>
    </InputTextDropdown>
  );
}
