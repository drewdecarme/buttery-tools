import { jsx as _jsx } from "react/jsx-runtime";
import React, { useContext, useMemo } from "react";
const ModalContext = React.createContext(null);
export function ModalProvider({ children, initialState, closeModal, }) {
    const value = useMemo(() => ({ initialState, closeModal }), [closeModal, initialState]);
    return (_jsx(ModalContext.Provider, { value: value, children: children }));
}
export const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("'useModalContext()' must be used within a <ModalProvider /> component");
    }
    return context;
};
