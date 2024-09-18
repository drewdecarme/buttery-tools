import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DropdownNav } from "../DropdownNav";
import { useDropdownNav } from "../dropdown-nav.useDropdownNav";
function NavMenuNested() {
    const { targetProps, dropdownProps } = useDropdownNav({
        id: "widget",
        dxPosition: "right-middle",
    });
    return (_jsxs("li", { children: [_jsx("button", { ...targetProps, children: "Widgets" }), _jsx(DropdownNav, { ...dropdownProps, children: _jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { href: "/products/sample/widget-2", children: "Widget 1" }) }), _jsx("li", { children: _jsx("a", { href: "/products/sample/widget-2", children: "Widget 2" }) }), _jsx("li", { children: _jsx("a", { href: "/products/sample/widget-3", children: "Widget 3" }) })] }) })] }));
}
export default () => {
    const { targetProps, dropdownProps } = useDropdownNav({
        id: "nested",
        dxPosition: "right-middle",
    });
    return (_jsx("nav", { children: _jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { href: "/", children: "Home" }) }), _jsxs("li", { children: [_jsx("button", { ...targetProps, children: "Products" }), _jsx(DropdownNav, { ...dropdownProps, children: _jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { href: "/products/sample", children: "Sample" }) }), _jsx(NavMenuNested, {})] }) })] }), _jsx("li", { children: _jsx("a", { href: "/pricing", children: "Pricing" }) })] }) }));
};
