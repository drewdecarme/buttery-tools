import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { randProduct } from "@ngneat/falso";
import { DropdownNav } from "../DropdownNav";
import { useDropdownNav } from "../dropdown-nav.useDropdownNav";
const products = [...new Array(4)].map(() => {
    const { title, category } = randProduct();
    return {
        title,
        category,
    };
});
export default () => {
    const { targetProps, dropdownProps } = useDropdownNav({
        id: "products-dropdown",
        dxOffset: 16,
        dxPosition: "bottom-center",
    });
    return (_jsx("nav", { children: _jsxs("ul", { style: {
                display: "flex",
                gap: "1rem",
                listStyleType: "none",
                padding: 0,
                margin: 0,
            }, children: [_jsx("li", { style: {
                        padding: "0 1rem",
                        display: "grid",
                        alignContent: "center",
                    }, children: _jsx("a", { href: "/", children: "Home" }) }), _jsxs("li", { children: [_jsx("button", { ...targetProps, children: "Products" }), _jsx(DropdownNav, { ...dropdownProps, children: _jsx("ul", { children: products.map((product) => (_jsx("li", { children: _jsxs("a", { href: `/products/${product.title}`, children: [_jsx("div", { children: product.title }), _jsx("div", { children: product.category })] }) }, product.title))) }) })] }), _jsx("li", { children: _jsx("a", { href: "/pricing", children: "Pricing" }) })] }) }));
};
