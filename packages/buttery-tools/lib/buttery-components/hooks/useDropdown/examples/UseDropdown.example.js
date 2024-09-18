import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useDropdown } from "../hook.useDropdown";
export default () => {
    const { openDropdown, closeDropdown, setDropdownRef, setTargetRef } = useDropdown({
        id: "use-dropdown",
    });
    return (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", ref: setTargetRef, onClick: openDropdown, children: "Open Dropdown" }), _jsxs("article", { ref: setDropdownRef, style: {
                    border: "1px solid red",
                }, children: ["this is some dropdown content", _jsx("button", { type: "button", onClick: closeDropdown, children: "Close Dropdown" })] })] }));
};
