import { type RefCallback, useCallback, useRef } from "react";

export const usePopover = () => {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useCallback<RefCallback<HTMLDivElement>>((node) => {
    if (!node) return;
    innerRef.current = node;
    node.popover = "manual";
  }, []);

  const showPopover = useCallback(() => {
    innerRef.current?.showPopover();
  }, []);

  const hidePopover = useCallback(() => {
    innerRef.current?.hidePopover();
  }, []);

  const togglePopover = useCallback(() => {
    innerRef.current?.togglePopover();
  }, []);

  return {
    popoverRef,
    showPopover,
    hidePopover,
    togglePopover,
  };
};
