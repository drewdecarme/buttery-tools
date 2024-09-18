import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DropdownNav } from "../DropdownNav";
import { useDropdownNav } from "../dropdown-nav.useDropdownNav";
const menuObjectTreeFetchedFromAnAPI = {
    name: "level-1",
    root: "/",
    links: [
        { display: "Home", to: "home" },
        {
            display: "Products",
            menu: {
                name: "level-2",
                root: "/products",
                links: [
                    { display: "doo dad", to: "doo-dad" },
                    {
                        display: "widgets",
                        menu: {
                            name: "level-3",
                            root: "/sample",
                            links: [
                                { display: "Widget 1", to: "widget-1" },
                                { display: "Widget 2", to: "widget-2" },
                                { display: "Widget 3", to: "widget-3" },
                            ],
                        },
                    },
                    { display: "thing-a-ma-bob", to: "thing-a-ma-bob" },
                ],
            },
        },
        { display: "Pricing", to: "pricing" },
        { display: "Blog", to: "blog" },
    ],
};
function MenuTree({ menu, root }) {
    const { targetProps, dropdownProps } = useDropdownNav({
        id: menu.name,
        dxPosition: "right-middle",
    });
    // build the base URL
    let baseURL;
    if (!root) {
        baseURL = "/";
    }
    else if (root === "/") {
        baseURL = menu.root;
    }
    else {
        baseURL = root.concat(menu.root);
    }
    return menu.links.map((link) => {
        // menu option has a href and should be rendered as a link
        if (link.to) {
            const href = `${baseURL === "/" ? "" : baseURL}/${link.to}`;
            return (_jsx("li", { children: _jsx("a", { href: href, children: link.display }) }, link.display));
        }
        // link has a menu, render a dropdown and recursively render the menu tree
        if (link.menu) {
            return (_jsxs("li", { children: [_jsx("button", { ...targetProps, children: link.display }), _jsx(DropdownNav, { ...dropdownProps, children: _jsx("ul", { children: _jsx(MenuTree, { menu: link.menu, root: baseURL }) }) })] }, link.display));
        }
        // no scenario here... this might be where you want to throw an error etc...
        // an improvement on this structure would be to use a discriminated union and use a switch case type-guard
        return null;
    });
}
export default () => {
    return (_jsx("nav", { children: _jsx("ul", { children: _jsx(MenuTree, { menu: menuObjectTreeFetchedFromAnAPI }) }) }));
};
