import {
  type MouseEventHandler,
  type RefCallback,
  useCallback,
  useRef,
} from "react";

export const usePopover = () => {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useCallback<RefCallback<HTMLDivElement>>((node) => {
    if (!node) return;
    innerRef.current = node;
    node.popover = "manual";
  }, []);

  const handleFocusIn = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(() => {
    innerRef.current?.showPopover();
  }, []);

  const handleFocusOut = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(() => {
    innerRef.current?.hidePopover();
  }, []);

  return {
    popoverRef,
    handlers: {
      onFocus: handleFocusIn,
      onBlur: handleFocusOut,
      onMouseEnter: handleFocusIn,
      onMouseLeave: handleFocusOut,
    },
  };
};
