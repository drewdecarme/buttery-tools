import type { ModalDefaultState } from "@BUTTERY_COMPONENT/useModalDialog";
import { type ReactNode, useMemo } from "react";

import { ModalContext, type ModalContextType } from "./Modal.context";

export type ModalProviderProps<T extends ModalDefaultState> = {
  children: ReactNode;
  initialState: T | undefined;
  closeModal: () => Promise<void>;
};

export function ModalProvider<T extends ModalDefaultState>({
  children,
  initialState,
  closeModal,
}: ModalProviderProps<T>) {
  const value = useMemo<ModalContextType<T>>(
    () => ({ initialState, closeModal }),
    [closeModal, initialState]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}
