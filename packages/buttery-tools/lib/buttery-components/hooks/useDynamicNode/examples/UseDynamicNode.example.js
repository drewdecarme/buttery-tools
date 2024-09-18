import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDynamicNode } from "../hook.useDynamicNode";
export default () => {
    const { getDynamicNode, destroyNode } = useDynamicNode();
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if (!isOpen)
            destroyNode();
    }, [destroyNode, isOpen]);
    return (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", onClick: () => setIsOpen((prevState) => !prevState), children: "toggle" }), isOpen &&
                createPortal(_jsx("div", { style: {
                        position: "fixed",
                        background: "limegreen",
                        top: "30%",
                        left: "30%",
                        padding: "2rem",
                    }, children: "I'm in a dynamic Node" }), getDynamicNode())] }));
};
