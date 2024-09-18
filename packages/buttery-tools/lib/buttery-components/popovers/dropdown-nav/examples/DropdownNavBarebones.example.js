import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DropdownNav } from "../DropdownNav";
import { useDropdownNav } from "../dropdown-nav.useDropdownNav";
export default () => {
    const { targetProps, dropdownProps } = useDropdownNav({
        id: "barebones",
        dxPosition: "right-middle",
    });
    return (_jsx("nav", { children: _jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { href: "/", children: "Home" }) }), _jsxs("li", { children: [_jsx("button", { type: "button", ...targetProps, children: "Products" }), _jsx(DropdownNav, { ...dropdownProps, children: _jsx("ul", { children: _jsx("li", { children: _jsx("a", { href: "/products/sample", children: "Sample" }) }) }) })] }), _jsx("li", { children: _jsx("a", { href: "/pricing", children: "Pricing" }) })] }) }));
};
