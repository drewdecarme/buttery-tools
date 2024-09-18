import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef, } from "react";
import { usePortal } from "../hook.usePortal";
export default () => {
    const { openPortal, closePortal, Portal } = usePortal();
    const buttonRef = useRef(null);
    const divRef = useRef(null);
    // Once the content ref mounts, then this function will run which
    // will take the boundingRect of the button and position the content
    // of the portal near it.
    const setContentRef = useCallback((node) => {
        if (!node || !buttonRef.current)
            return;
        const buttonRect = buttonRef.current.getBoundingClientRect();
        divRef.current = node;
        divRef.current.style.left = buttonRect.left.toString().concat("px");
        divRef.current.style.top = buttonRect.bottom.toString().concat("px");
    }, []);
    // Depending upon the existence of the divRef, this function will toggle
    // the appearance of the portal.
    const toggleContent = useCallback((e) => {
        buttonRef.current = e.currentTarget;
        if (divRef.current === null) {
            return openPortal();
        }
        closePortal();
        divRef.current = null;
    }, [openPortal, closePortal]);
    return (_jsxs("div", { children: [_jsx("button", { type: "button", onClick: toggleContent, children: "Toggle Portal" }), _jsx(Portal, { children: _jsx("div", { ref: setContentRef, style: {
                        position: "fixed",
                        padding: "1rem",
                        border: "1px solid red",
                    }, children: "Portal Content" }) })] }));
};
