import { useCallback, useMemo, useRef } from "react";

import type { InputTextDropdownRef } from "./InputTextDropdown.js";

export function useInputTextDropdown() {
  const ref = useRef<InputTextDropdownRef>(null);

  const closeDropdown = useCallback<InputTextDropdownRef["handleClose"]>(() => {
    if (!ref.current) return;
    ref.current.handleClose();
  }, []);

  const setValue = useCallback<InputTextDropdownRef["setValue"]>((value) => {
    if (!ref.current) return;
    ref.current.setValue(value);
  }, []);

  return useMemo(
    () => ({
      ref,
      closeDropdown,
      setValue,
    }),
    [closeDropdown, setValue]
  );
}
