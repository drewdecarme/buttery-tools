import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Drawer } from "../Drawer";
import { useDrawer } from "../drawer.useDrawer";
export default () => {
    const { drawerRef, openDrawer } = useDrawer();
    return (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", onClick: openDrawer, children: "Open drawer without style" }), _jsx(Drawer, { ref: drawerRef, dxOrientation: "slide-left", children: "This is some drawer content!" })] }));
};
