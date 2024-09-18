import { jsx as _jsx } from "react/jsx-runtime";
import { Responsive } from "./Responsive";
export const ResponsiveMobile = ({ children }) => {
    return _jsx(Responsive, { to: "tablet", children: children });
};
