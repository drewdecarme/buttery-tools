import { type ReactNode } from "react";
import type { ModalDefaultState } from "../hooks";
type ModalContextType<T extends ModalDefaultState = ModalDefaultState> = {
    initialState: T | undefined;
    closeModal: () => Promise<void>;
};
export type ModalProviderProps<T extends ModalDefaultState> = {
    children: ReactNode;
    initialState: T | undefined;
    closeModal: () => Promise<void>;
};
export declare function ModalProvider<T extends ModalDefaultState>({ children, initialState, closeModal, }: ModalProviderProps<T>): import("react/jsx-runtime").JSX.Element;
export declare const useModalContext: () => ModalContextType;
export {};
//# sourceMappingURL=Modal.context.d.ts.map