import React, { type ReactNode, useContext, useMemo } from "react";
import type { ModalDefaultState } from "../hooks";

type ModalContextType<T extends ModalDefaultState = ModalDefaultState> = {
  initialState: T | undefined;
  closeModal: () => Promise<void>;
};
const ModalContext = React.createContext<ModalContextType | null>(null);
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

export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "'useModalContext()' must be used within a <ModalProvider /> component"
    );
  }
  return context;
};
