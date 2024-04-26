import React, { ReactNode, useContext, useMemo } from "react";
import { DialogDefaultState } from "./dialog.useDialog";

type DialogContextType<T extends DialogDefaultState = DialogDefaultState> = {
  initialState: T | undefined;
  closeDialog: () => Promise<void>;
};
const DialogContext = React.createContext<DialogContextType | null>(null);
export type DialogProviderProps<T extends DialogDefaultState> = {
  children: ReactNode;
  initialState: T | undefined;
  closeDialog: () => Promise<void>;
};
export function DialogProvider<T extends DialogDefaultState>({
  children,
  initialState,
  closeDialog,
}: DialogProviderProps<T>) {
  const value = useMemo<DialogContextType<T>>(
    () => ({ initialState, closeDialog }),
    [closeDialog, initialState],
  );

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}

export const useDialogContext = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(
      "'useDialogContext()' must be used within a <DialogProvider /> component",
    );
  }
  return context;
};
