import type { FocusEventHandler, RefCallback } from "react";
import { useRef, useId, useState, useMemo, useCallback } from "react";

import {
  useDropdown,
  type UseDropdownOptions,
} from "@BUTTERY_COMPONENT/useDropdown/useDropdown.js";
import { useWindowEventListener } from "@BUTTERY_COMPONENT/useWindowEventListener/useWindowEventListener.js";

import { LOG_UID } from "./use-input-dropdown.utils.js";

export type UseInputDropdownParams = UseDropdownOptions & {};

export function useInputDropdown<
  InputElement extends
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement,
  DropdownElement extends HTMLElement
>({ dxArrow, dxOffset, dxPosition }: UseInputDropdownParams) {
  const inputRef = useRef<InputElement | null>(null);
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownOptions = useMemo<UseDropdownOptions>(
    () => ({ id, dxPosition, dxArrow, dxOffset }),
    [id, dxPosition, dxArrow, dxOffset]
  );
  const {
    openDropdown,
    setDropdownRef: setUseDropdownRef,
    setTargetRef,
    closeDropdown,
    dropdownRef,
  } = useDropdown<DropdownElement>(dropdownOptions);

  const { addWindowEventListener, removeWindowEventListener } =
    useWindowEventListener();

  // Set the inputRef to the target of the dropdown so the
  // dropdown knows where to mount itself
  const setInputRef = useCallback<RefCallback<InputElement>>(
    (inputNode) => {
      if (!inputNode) return;
      setTargetRef(inputNode);
      inputRef.current = inputNode;
    },
    [setTargetRef]
  );

  // A central handler for removing the event listener
  // and then also closing the dropdown
  const handleClose = useCallback(async () => {
    LOG_UID.debug("Removing the keydown window event listener...");
    removeWindowEventListener("keydown");
    LOG_UID.debug("Removing the keydown window event listener... done.");

    LOG_UID.debug("Closing the dropdown...");
    await closeDropdown();
    LOG_UID.debug("Closing the dropdown... done.");

    LOG_UID.debug(
      "Setting open to false to remove the popover content from the DOM."
    );
    setIsOpen(false);
  }, [removeWindowEventListener, closeDropdown]);

  // Set the dropdownRef to the div when it becomes available
  // in the DOM. Once it mounts in the DOM we can then open
  // the dropdown in relation to the target, which is set above.
  const setDropdownRef = useCallback<RefCallback<DropdownElement>>(
    (dropdownNode) => {
      if (!dropdownNode) return;
      LOG_UID.debug(
        "Dropdown content has mounted... setting dropdown and opening."
      );
      // set the dropdown ref to the node once the isOpen state is true
      setUseDropdownRef(dropdownNode);

      // open the dropdown
      openDropdown();

      LOG_UID.debug("Adding window keydown event listener...");
      addWindowEventListener("keydown", (e) => {
        // don't propagate this to other window listeners declared.
        e.stopImmediatePropagation();

        switch (e.key) {
          case "Escape":
            LOG_UID.debug("Escape key pressed. Closing the dropdown.");
            handleClose();
            break;

          default:
            break;
        }
      });
    },
    [setUseDropdownRef, openDropdown, addWindowEventListener, handleClose]
  );

  const handleDropdownBlur = useCallback<FocusEventHandler<HTMLInputElement>>(
    ({ currentTarget, relatedTarget }) => {
      if (!currentTarget.contains(relatedTarget)) {
        LOG_UID.debug("Blurred out of the dropdown DIV. Closing dropdown.");
        handleClose();
      }
    },
    [handleClose]
  );

  // Opens the dropdown and add some listeners
  const handleFocus = useCallback<FocusEventHandler<HTMLInputElement>>(() => {
    LOG_UID.debug("Focused into input. Setting to open.");
    setIsOpen(true);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      const focusedElement = document.activeElement;
      LOG_UID.debug("Input blurred...");

      if (!dropdownRef.current?.contains(focusedElement)) {
        LOG_UID.debug(
          "INput was blurred... active element isn't a part of the dropdown. Closing dropdown."
        );
        handleClose();
      } else {
        LOG_UID.debug(
          "Input was blurred... but next active element was part of the dropdown"
        );
      }
    }, 0);
  }, [dropdownRef, handleClose]);

  const dropdownProps = useMemo(
    () => ({
      onBlur: handleDropdownBlur,
    }),
    [handleDropdownBlur]
  );

  const inputProps = useMemo(
    () => ({
      onFocus: handleFocus,
      onBlur: handleBlur,
    }),
    [handleBlur, handleFocus]
  );

  return {
    isOpen,
    setDropdownRef,
    setInputRef,
    inputProps,
    dropdownProps,
  };
}
