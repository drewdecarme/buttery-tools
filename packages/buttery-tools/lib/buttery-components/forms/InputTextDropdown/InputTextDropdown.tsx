import { clsx } from "clsx";
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
import {
  type DropdownOptions,
  type UseDropdownOptions,
  useDropdown,
} from "../../hooks/useDropdown";
import { useWindowEventListener } from "../../hooks/useWindowEventListener";

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
    console.log("handle close");
    console.log("remove window listener");
    removeWindowEventListener("keydown");
    console.log("closing dropdown...");
    await closeDropdown();
    console.log("closing dropdown... done.");

    console.log("Setting open to false");
    setIsOpen(false);
  }, [removeWindowEventListener, closeDropdown]);

  // Set the dropdownRef to the div when it becomes available
  // in the DOM. Once it mounts in the DOM we can then open
  // the dropdown in relation to the target, which is set above.
  const setDivRef = useCallback<RefCallback<HTMLDivElement>>(
    (divNode) => {
      if (!divNode) return;
      // set the dropdown ref to the node once the isOpen state is true
      setDropdownRef(divNode);

      // open the dropdown
      openDropdown();

      console.log("Adding window keydown event listener...");
      addWindowEventListener("keydown", (e) => {
        // don't propagate this to other window listeners declared.
        e.stopImmediatePropagation();

        switch (e.key) {
          case "Escape":
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
        console.log("Blurred out of the dropdown... closing dropdown.");
        handleClose();
      }
    },
    [handleClose]
  );

  // Opens the dropdown and add some listeners
  const handleFocus = useCallback<FocusEventHandler<HTMLInputElement>>(() => {
    console.log("focusing...");
    setIsOpen(true);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      const focusedElement = document.activeElement;
      console.log("Input blurred...");

      if (!dropdownRef.current?.contains(focusedElement)) {
        console.log(
          "INput was blurred... active element isn't a part of the dropdown. Closing dropdown."
        );
        handleClose();
      } else {
        console.log(
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
        inputRef.current.value = value;
      },
      inputRef,
    };
  });

  console.log({ isOpen });

  return (
    <div>
      <input
        // {...restProps}
        className={clsx(className)}
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
