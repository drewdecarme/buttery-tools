import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DropdownMenu } from "../DropdownMenu";
import { useDropdownMenu } from "../dropdown-menu.useDropdownMenu";
export default () => {
    const { targetProps, dropdownProps } = useDropdownMenu({
        id: "barebones",
    });
    return (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", ...targetProps, children: "Toggle Context Menu" }), _jsx(DropdownMenu, { ...dropdownProps, children: _jsxs("ul", { children: [_jsx("li", { children: _jsx("button", { type: "button", children: "Print" }) }), _jsx("li", { children: _jsx("button", { type: "button", children: "Send" }) }), _jsx("li", { children: _jsx("button", { type: "button", children: "Forward" }) }), _jsx("li", { children: _jsx("button", { type: "button", children: "Delete" }) })] }) })] }));
};
