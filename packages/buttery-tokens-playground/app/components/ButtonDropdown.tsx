import { classes, useDropdownMenu } from "@buttery/components";
import type { MouseEventHandler } from "react";
import { forwardRef, useCallback } from "react";
import { css } from "@linaria/core";
import { makeColor, makeRem, makeReset } from "@buttery/tokens/playground";

import { IconArrowDown } from "~/icons/IconArrowDown";

import {
  Button,
  createButtonClassNames,
  type ButtonPropsCustom,
} from "./Button";
import { createDropdownStyles } from "./shared-styles";

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

export const buttonDropdownClassName = "btn-dropdown";

const styles = css`
  display: grid;
  grid-template-columns: auto auto;
  height: min-content;

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

const dropdownStyles = createDropdownStyles(css`
  ${makeReset("ul")};
  border-radius: ${makeRem(4)} !important;

  &.c-primary {
    border: ${makeRem(1)} solid ${makeColor("primary")};
  }
  &.c-secondary {
    border: ${makeRem(1)} solid ${makeColor("secondary")};
  }

  button {
    ${makeReset("button")};
    white-space: nowrap;
  }

  &.s-dense {
    padding: ${makeRem(4)};

    button {
      font-size: ${makeRem(10)};
      padding: ${makeRem(4)} ${makeRem(8)};
    }
  }

  &.s-normal {
    padding: ${makeRem(4)};

    button {
      font-size: ${makeRem(12)};
      padding: ${makeRem(4)} ${makeRem(12)};
    }
  }
`);

function ButtonDropdownOption({
  dxAction,
  dxLabel,
  onClose,
  className,
}: ButtonDropdownOption & { onClose: () => void; className?: string }) {
  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (e) => {
      dxAction(e);
      onClose();
    },
    [dxAction, onClose]
  );
  return (
    <button onClick={handleClick} className={className}>
      {dxLabel}
    </button>
  );
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
    <div
      className={classes(buttonDropdownClassName, styles)}
      ref={alignmentRef}
    >
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
      <ul
        ref={setDropdownRef}
        className={classes(
          dropdownStyles,
          createButtonClassNames({ dxColor, dxSize, dxVariant })
        )}
      >
        {dxOptions.map((option) => (
          <li key={option.dxLabel}>
            <ButtonDropdownOption {...option} onClose={closeMenu} />
          </li>
        ))}
      </ul>
    </div>
  );
});
