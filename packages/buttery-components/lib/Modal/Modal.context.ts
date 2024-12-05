import type { ModalDefaultState } from "@BUTTERY_COMPONENT/useModalDialog/index.js";
import React from "react";

export type ModalContextType<T extends ModalDefaultState = ModalDefaultState> =
  {
    initialState: T | undefined;
    closeModal: () => Promise<void>;
  };
export const ModalContext = React.createContext<ModalContextType | null>(null);
