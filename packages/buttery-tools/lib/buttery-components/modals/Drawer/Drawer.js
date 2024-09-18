import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { classes } from "../../utils";
import { Modal } from "../Modal";
export const Drawer = forwardRef(function Drawer({ children, dxOrientation = "slide-left", className, ...restProps }, ref) {
    return (_jsx(Modal, { ...restProps, className: classes("drawer", dxOrientation, className), 
        // @ts-expect-error The ref's matchup however TS doesn't like the fact that you
        // can instantiate it with a different state. We're not concerned with this since
        // we're only using this component as a ref proxy and don't care about the types
        // internally to this component
        ref: ref, children: children }));
});
