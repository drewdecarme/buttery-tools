import type { DropdownOptions } from "@buttery/components";
import {
  classes,
  InputTextDropdown,
  useInputTextDropdown,
} from "@buttery/components";
import { css } from "@linaria/core";
import { useCallback, type JSX, type ReactNode } from "react";

import { InputSelectDropdownProvider } from "./InputSelectDropdown.context";
import { createInputTextClassName } from "./InputText";

export type InputSelectDropdownPropsNative = JSX.IntrinsicElements["input"];
export type InputSelectDropdownPropsCustom = DropdownOptions & {
  dxOnSelect?: (value: string) => void;
  children: ReactNode;
};
export type InputSelectDropdownProps = InputSelectDropdownPropsNative &
  InputSelectDropdownPropsCustom;

const styles = css`
  opacity: 0;
  border: none;
  transform: scale(0.9);
  filter: drop-shadow(3px 8px 28px rgba(130, 130, 130, 0.3));
  border-radius: 0.5rem;
  padding: 0;
  width: 200px;

  /* Animation for appearing */
  @keyframes appear {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Animation for disappearing */
  @keyframes disappear {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.9);
    }
  }

  &.open {
    animation: appear 0.15s forwards;
  }

  &.close {
    animation: disappear 0.15s forwards;
  }
`;

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
      className={classes(
        createInputTextClassName({ dxSize: "dense" }),
        className
      )}
      dxDropdownClassName={styles}
      ref={ref}
    >
      <InputSelectDropdownProvider onSelect={handleSelect}>
        {children}
      </InputSelectDropdownProvider>
    </InputTextDropdown>
  );
}
