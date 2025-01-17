import {
  makeColor,
  makePx,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";
import { useCallback, useMemo } from "react";
import { useDropdownMenu, useToggle } from "@buttery/components";
import { css } from "@linaria/core";

import { VariantContainerBarActions } from "~/components/VariantContainerBarActions";
import { VariantContainerBarTitle } from "~/components/VariantContainerBarTitle";
import { VariantContainerBar } from "~/components/VariantContainerBar";
import { VariantContainer } from "~/components/VariantContainer";
import { Button } from "~/components/Button";
import { IconDelete } from "~/icons/IconDelete";
import { IconPencilEdit01 } from "~/icons/IconPencilEdit01";
import { VariantContainerContent } from "~/components/VariantContainerContent";
import { IconInsertRow } from "~/icons/IconInsertRow";
import { IconPlusSign } from "~/icons/IconPlusSign";
import { Dropdown } from "~/components/Dropdown";

import type {
  ConfigurationStateResponseBreakpointValue,
  OnResponseBreakpointAction,
} from "./config.utils.response";

const barStyles = css`
  grid-template-columns: ${makeRem(100)} 1fr auto !important;
`;

const dropdownStyles = css`
  ul {
    ${makeReset("ul")};
    display: flex;
    flex-direction: column;
    gap: ${makeRem(4)};

    button {
      background: transparent;
      &:hover {
        background: ${makeColor("neutral-light", { opacity: 0.1 })};
      }
    }
  }
`;

export function BreakpointConfigVariant({
  breakpoint,
  breakpointId,
  breakpointIndex,
  onAction,
}: {
  breakpointId: string;
  breakpointIndex: number;
  breakpoint: ConfigurationStateResponseBreakpointValue;
  onAction: OnResponseBreakpointAction;
}) {
  const [isOpen, toggle] = useToggle();

  const handleDelete = useCallback(() => {
    onAction({ action: "deleteBreakpoint", id: breakpointId });
  }, [breakpointId, onAction]);

  const { setDropdownRef, setTargetRef, closeMenu } = useDropdownMenu<
    HTMLDivElement,
    HTMLDivElement
  >({
    dxArrow: {
      size: 16,
      color: "inherit",
    },
  });

  const addVariantAbove = useCallback(() => {
    onAction({
      action: "addBreakpointDirection",
      direction: "above",
      referenceIndex: breakpointIndex,
    });
    closeMenu();
  }, [breakpointIndex, closeMenu, onAction]);

  const addVariantBelow = useCallback(() => {
    onAction({
      action: "addBreakpointDirection",
      direction: "below",
      referenceIndex: breakpointIndex,
    });
    closeMenu();
  }, [breakpointIndex, closeMenu, onAction]);

  return (
    <VariantContainer>
      <VariantContainerBar className={barStyles}>
        <VariantContainerBarTitle>{breakpoint.name}</VariantContainerBarTitle>
        <div>{makePx(breakpoint.value)}</div>
        <VariantContainerBarActions>
          {useMemo(
            () => (
              <VariantContainerBarActions>
                <div>
                  <Button
                    ref={setTargetRef}
                    dxVariant="icon"
                    DXIcon={IconInsertRow}
                    dxSize="dense"
                  />
                  <Dropdown ref={setDropdownRef} className={dropdownStyles}>
                    <ul>
                      <li>
                        <Button
                          dxVariant="text"
                          dxSize="dense"
                          DXIconStart={IconPlusSign}
                          onClick={addVariantAbove}
                        >
                          Insert 1 row above
                        </Button>
                      </li>
                      <li>
                        <Button
                          dxVariant="text"
                          dxSize="dense"
                          DXIconStart={IconPlusSign}
                          onClick={addVariantBelow}
                        >
                          Insert 1 row below
                        </Button>
                      </li>
                    </ul>
                  </Dropdown>
                </div>
                <Button
                  dxVariant="icon"
                  DXIcon={IconPencilEdit01}
                  onClick={toggle}
                  dxSize="dense"
                  dxHelp="Edit variant"
                />
                <Button
                  dxVariant="icon"
                  DXIcon={IconDelete}
                  onClick={handleDelete}
                  dxSize="dense"
                  dxHelp="Delete variant"
                />
              </VariantContainerBarActions>
            ),
            [
              addVariantAbove,
              addVariantBelow,
              handleDelete,
              setDropdownRef,
              setTargetRef,
              toggle,
            ]
          )}
        </VariantContainerBarActions>
      </VariantContainerBar>
      {isOpen && <VariantContainerContent>content</VariantContainerContent>}
    </VariantContainer>
  );
}
