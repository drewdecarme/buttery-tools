import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Toast } from "./Toast";
import { deleteToastOptions, getToastOptions, toastContainerId, } from "./toast.utils";
export function Toaster({ ToastComponent, id, }) {
    const [toasts, setToasts] = useState({});
    const mutationObserverRef = useRef(undefined);
    const toasterRef = useRef(null);
    useEffect(() => {
        if (typeof window === "undefined" || !toasterRef.current)
            return;
        // disconnect when the toaster mounts.
        const callback = (mutationList) => {
            for (const mutation of mutationList) {
                if (mutation.type !== "childList")
                    return;
                if (mutation.addedNodes.length) {
                    for (const addedNode of mutation.addedNodes) {
                        const toastProps = getToastOptions(addedNode);
                        setToasts((prevState) => ({
                            ...prevState,
                            [toastProps.id]: toastProps,
                        }));
                    }
                }
                if (mutation.removedNodes.length) {
                    for (const removedNode of mutation.removedNodes) {
                        const toastProps = getToastOptions(removedNode);
                        setToasts((prevState) => {
                            const { [toastProps.id]: deletedToast, ...restState } = prevState;
                            deleteToastOptions(toastProps.id);
                            return restState;
                        });
                    }
                }
            }
        };
        mutationObserverRef.current = new MutationObserver(callback);
        console.log("Connecting mutation observer");
        mutationObserverRef.current.observe(toasterRef.current, {
            attributes: true,
            childList: true,
            subtree: true,
        });
        // disconnect when the toaster is removed.
        return () => {
            console.log("Disconnecting mutation observer");
            mutationObserverRef.current?.disconnect();
        };
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx("div", { id: id ?? toastContainerId, style: { display: "none" }, ref: toasterRef }), Object.values(toasts).length > 0 &&
                ReactDOM.createPortal(Object.entries(toasts).map(([id, toastProps]) => {
                    return (_jsx(Toast, { id: id, children: _jsx(ToastComponent, { ...toastProps }) }, id));
                }), document.body)] }));
}
