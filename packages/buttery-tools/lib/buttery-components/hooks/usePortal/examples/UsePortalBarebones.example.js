import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePortal } from "../hook.usePortal";
export default () => {
    const { closePortal, togglePortal, Portal } = usePortal();
    return (_jsxs("div", { children: [_jsx("button", { type: "button", onClick: togglePortal, children: "Toggle Portal" }), _jsx(Portal, { children: _jsxs("div", { style: {
                        zIndex: 10,
                        position: "fixed",
                        background: "red",
                        top: 0,
                    }, children: ["Portal Content", _jsx("button", { type: "button", onClick: closePortal, children: "Close Portal" })] }) })] }));
};
