import {
  type DropdownOptions,
  type UseDropdownOptions,
  useDropdown,
} from "@BUTTERY_COMPONENT/useDropdown";
import { useWindowEventListener } from "@BUTTERY_COMPONENT/useWindowEventListener";
import { classes } from "@BUTTERY_COMPONENT/utils";
import {
  type FocusEventHandler,
  type MutableRefObject,
  type ReactNode,
  type RefCallback,
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { LOG_ITD } from "./input-text-dropdown.utils";

export type InputTextDropdownRef = {
  setValue: (value: string) => void;
  handleClose: () => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
};

export type InputTextDropdownPropsNative = JSX.IntrinsicElements["input"];
export type InputTextDropdownPropsCustom = DropdownOptions & {
  children: ReactNode;
};
export type InputTextDropdownProps = Omit<InputTextDropdownPropsNative, "ref"> &
  InputTextDropdownPropsCustom;

export const InputTextDropdown = forwardRef<
  InputTextDropdownRef,
  InputTextDropdownProps
>(function InputTextDropdown(
  { children, className, dxPosition, dxArrow, dxOffset, ...restProps },
  ref
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownOptions = useMemo<UseDropdownOptions>(
    () => ({ id, dxPosition, dxArrow, dxOffset }),
    [id, dxPosition, dxArrow, dxOffset]
  );
  const {
    openDropdown,
    setDropdownRef,
    setTargetRef,
    closeDropdown,
    dropdownRef,
  } = useDropdown<HTMLDivElement>(dropdownOptions);

  const { addWindowEventListener, removeWindowEventListener } =
    useWindowEventListener();

  // Set the inputRef to the target of the dropdown so the
  // dropdown knows where to mount itself
  const setInputRef = useCallback<RefCallback<HTMLInputElement>>(
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
    LOG_ITD.debug("Removing the keydown window event listener...");
    removeWindowEventListener("keydown");
    LOG_ITD.debug("Removing the keydown window event listener... done.");

    LOG_ITD.debug("Closing the dropdown...");
    await closeDropdown();
    LOG_ITD.debug("Closing the dropdown... done.");

    LOG_ITD.debug(
      "Setting open to false to remove the popover content from the DOM."
    );
    setIsOpen(false);
  }, [removeWindowEventListener, closeDropdown]);

  // Set the dropdownRef to the div when it becomes available
  // in the DOM. Once it mounts in the DOM we can then open
  // the dropdown in relation to the target, which is set above.
  const setDivRef = useCallback<RefCallback<HTMLDivElement>>(
    (divNode) => {
      if (!divNode) return;
      LOG_ITD.debug(
        "Dropdown content has mounted... setting dropdown and opening."
      );
      // set the dropdown ref to the node once the isOpen state is true
      setDropdownRef(divNode);

      // open the dropdown
      openDropdown();

      LOG_ITD.debug("Adding window keydown event listener...");
      addWindowEventListener("keydown", (e) => {
        // don't propagate this to other window listeners declared.
        e.stopImmediatePropagation();

        switch (e.key) {
          case "Escape":
            LOG_ITD.debug("Escape key pressed. Closing the dropdown.");
            handleClose();
            break;

          default:
            break;
        }
      });
    },
    [setDropdownRef, openDropdown, addWindowEventListener, handleClose]
  );

  const handleDropdownBlur = useCallback<FocusEventHandler<HTMLInputElement>>(
    ({ currentTarget, relatedTarget }) => {
      if (!currentTarget.contains(relatedTarget)) {
        LOG_ITD.debug("Blurred out of the dropdown DIV. Closing dropdown.");
        handleClose();
      }
    },
    [handleClose]
  );

  // Opens the dropdown and add some listeners
  const handleFocus = useCallback<FocusEventHandler<HTMLInputElement>>(() => {
    LOG_ITD.debug("Focused into input. Setting to open.");
    setIsOpen(true);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      const focusedElement = document.activeElement;
      LOG_ITD.debug("Input blurred...");

      if (!dropdownRef.current?.contains(focusedElement)) {
        LOG_ITD.debug(
          "INput was blurred... active element isn't a part of the dropdown. Closing dropdown."
        );
        handleClose();
      } else {
        LOG_ITD.debug(
          "Input was blurred... but next active element was part of the dropdown"
        );
      }
    }, 0);
  }, [dropdownRef, handleClose]);

  // Set the ref with other functions to be used
  // outside the context of this component
  useImperativeHandle(ref, () => {
    return {
      handleClose,
      setValue: (value) => {
        if (!inputRef.current) return;
        LOG_ITD.debug(
          "Input value has been set outside of the context of the dropdown. Setting value.",
          { value }
        );
        inputRef.current.value = value;
      },
      inputRef,
    };
  });

  return (
    <div>
      <input
        {...restProps}
        className={classes(className)}
        ref={setInputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {isOpen ? (
        <div ref={setDivRef} onBlur={handleDropdownBlur}>
          {children}
        </div>
      ) : null}
    </div>
  );
});
