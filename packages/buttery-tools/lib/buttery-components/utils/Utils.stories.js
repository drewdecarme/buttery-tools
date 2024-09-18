import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ResponsiveDesktop } from "./ResponsiveDesktop";
import { ResponsiveMobile } from "./ResponsiveMobile";
import { ResponsiveTablet } from "./ResponsiveTablet";
const meta = {
    title: "Utils / Responsive",
    parameters: {
        layout: "centered",
    },
};
export default meta;
const Content = () => {
    return (_jsx("div", { style: {
            marginTop: "1rem",
            width: "100%",
            padding: "2rem",
            border: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }, children: "hello \uD83D\uDE04" }));
};
export const Variants = () => {
    return (_jsxs(_Fragment, { children: [_jsxs("div", { children: ["The below should only display when the viewport is below", " ", _jsx("strong", { children: "tablet" })] }), _jsx(ResponsiveMobile, { children: _jsx(Content, {}) }), _jsx("br", {}), _jsx("br", {}), _jsxs("div", { children: ["The below should only display when the viewport is between", " ", _jsx("strong", { children: "tablet" }), " & ", _jsx("strong", { children: "desktop" })] }), _jsx(ResponsiveTablet, { children: _jsx(Content, {}) }), _jsx("br", {}), _jsx("br", {}), _jsxs("div", { children: ["The below should only display when the viewport is above", " ", _jsx("strong", { children: "desktop" })] }), _jsx(ResponsiveDesktop, { children: _jsx(Content, {}) })] }));
};
