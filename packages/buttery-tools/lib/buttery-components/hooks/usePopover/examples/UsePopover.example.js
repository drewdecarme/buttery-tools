import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { usePopover } from "../hook.usePopover";
export default () => {
    const { setPopoverRef, setTargetRef, showPopover, hidePopover } = usePopover({
        id: "use-popover",
    });
    return (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", ref: setTargetRef, onClick: showPopover, children: "Open Popover" }), _jsxs("article", { ref: setPopoverRef, style: {
                    border: "1px solid red",
                }, children: ["this is some popover content", _jsx("button", { type: "button", onClick: hidePopover, children: "Close Popover" })] })] }));
};
