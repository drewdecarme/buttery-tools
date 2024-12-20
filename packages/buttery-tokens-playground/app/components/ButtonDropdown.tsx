import { useDropdownMenu } from "@buttery/components";
import type { MouseEventHandler } from "react";
import { forwardRef, useCallback } from "react";
import { css } from "@linaria/core";
import { makeRem } from "@buttery/tokens/playground";

import { IconArrowDown } from "~/icons/IconArrowDown";

import { Button, type ButtonPropsCustom } from "./Button";

export type ButtonDropdownOption = {
  dxLabel: string;
  dxAction: MouseEventHandler<HTMLButtonElement>;
};
export type ButtonDropdownPropsNative = Omit<
  JSX.IntrinsicElements["button"],
  "className"
>;
export type ButtonDropdownPropsCustom = ButtonPropsCustom & {
  /**
   * The dropdown options of the button
   */
  dxOptions: ButtonDropdownOption[];
};
export type ButtonDropdownProps = ButtonDropdownPropsNative &
  ButtonDropdownPropsCustom;

const styles = css`
  display: inline-flex;
  align-items: stretch;

  & > button {
    &:nth-child(1) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;

      &.v {
        &-contained {
          border-right: ${makeRem(1)} solid white;
        }
      }

      &.v {
        &-outlined {
          border-right: 0;
        }
      }
    }
    &:nth-child(2) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 0;
      padding: 0;
      aspect-ratio: 1 / 1;
      display: grid;
      place-content: center;
    }
  }
`;

function ButtonDropdownOption({
  dxAction,
  dxLabel,
  onClose,
}: ButtonDropdownOption & { onClose: () => void }) {
  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (e) => {
      dxAction(e);
      onClose();
    },
    [dxAction, onClose]
  );
  return <button onClick={handleClick}>{dxLabel}</button>;
}

export const ButtonDropdown = forwardRef<
  HTMLButtonElement,
  ButtonDropdownProps
>(function ButtonDropdown(
  {
    children,
    dxOptions,
    DXAdornmentStart,
    dxColor = "primary",
    dxVariant = "contained",
    dxSize = "normal",
    ...restProps
  },
  ref
) {
  const { closeMenu, setTargetRef, setDropdownRef, alignmentRef } =
    useDropdownMenu<HTMLUListElement, HTMLDivElement>({
      dxOffset: 4,
      dxPosition: "bottom-left",
    });

  return (
    <div className={styles} ref={alignmentRef}>
      <Button
        ref={ref}
        dxColor={dxColor}
        dxSize={dxSize}
        dxVariant={dxVariant}
        {...restProps}
      >
        {children}
      </Button>
      <Button
        ref={setTargetRef}
        dxColor={dxColor}
        dxSize={dxSize}
        dxVariant={dxVariant}
      >
        <IconArrowDown dxSize={dxSize === "dense" ? 12 : 14} />
      </Button>
      <ul ref={setDropdownRef} className="dropdown">
        {dxOptions.map((option) => (
          <li key={option.dxLabel}>
            <ButtonDropdownOption {...option} onClose={closeMenu} />
          </li>
        ))}
      </ul>
    </div>
  );
});
