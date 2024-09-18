import { jsx as _jsx } from "react/jsx-runtime";
import { Responsive } from "./Responsive";
export const ResponsiveTablet = ({ children }) => {
    return _jsx(Responsive, { from: "tablet", children: children });
};
