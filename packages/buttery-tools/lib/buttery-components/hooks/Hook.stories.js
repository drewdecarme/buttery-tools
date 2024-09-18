import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { randFullName, randIceHockeyTeam, randJobTitle } from "@ngneat/falso";
import { useRef } from "react";
import { breakpointMap, useBreakpoint } from "./hook.useBreakpoint";
import { useCarousel } from "./hook.useCarousel";
import { useToggle } from "./hook.useToggle";
const meta = {
    title: "Utils / Hooks",
    parameters: {
        layout: "centered"
    }
};
export default meta;
export const UseToggle = () => {
    const [isOpen, toggle] = useToggle();
    return (_jsxs("button", { type: "button", onClick: toggle, children: ["Click to ", isOpen ? "close" : "open"] }));
};
export const UseCarousel = () => {
    const itemsRef = useRef([...new Array(5)].map(() => ({
        name: randFullName(),
        job: randJobTitle(),
        favIceHockeyTeam: randIceHockeyTeam()
    })));
    const { currentItem, next, prev } = useCarousel(itemsRef.current);
    return (_jsxs("div", { children: [_jsxs("div", { style: {
                    display: "flex",
                    justifyContent: "space-around",
                    gap: "1rem",
                    width: "min-content",
                    margin: "0 auto"
                }, children: [_jsx("button", { type: "button", onClick: prev, children: "back" }), _jsx("button", { type: "button", onClick: next, children: "forward" })] }), _jsx("pre", { style: {
                    padding: " 1rem",
                    fontSize: "1rem",
                    background: "#ccc",
                    borderRadius: ".5rem"
                }, children: JSON.stringify(currentItem, null, 2) })] }));
};
export const UseBreakpoint = () => {
    const shouldRender = useBreakpoint("mobile");
    const shouldRenderBetween = useBreakpoint({ from: "tablet", to: "desktop" });
    console.log("shouldRenderBetween", shouldRenderBetween);
    const shouldRenderMax = useBreakpoint("desktop");
    return (_jsxs("div", { style: {
            maxWidth: "50ch"
        }, children: [_jsxs("div", { children: ["Current Width:", " ", _jsx("code", { children: _jsxs("strong", { children: [typeof window !== "undefined" && window.innerWidth, "px"] }) })] }), _jsx("br", {}), "The box should turn", " ", _jsx("span", { style: {
                    color: "blue",
                    fontWeight: "bold"
                }, children: "BLUE" }), " ", "when the viewport:", _jsx("ul", { children: _jsxs("li", { children: ["GREATER THAN:", " ", _jsx("code", { children: _jsxs("strong", { children: [breakpointMap.mobile, "px"] }) })] }) }), _jsx("br", {}), _jsx("div", { style: {
                    height: "2rem",
                    width: "100%",
                    background: shouldRender ? "blue" : "#ccc"
                } }), _jsx("br", {}), _jsx("br", {}), _jsxs("div", { children: ["The box should turn", " ", _jsx("span", { style: {
                            color: "green",
                            fontWeight: "bold"
                        }, children: "GREEN" }), " ", "when the viewport:", _jsxs("ul", { children: [_jsxs("li", { children: ["GREATER THAN:\u00A0", _jsx("code", { children: _jsxs("strong", { children: [breakpointMap.tablet, "px"] }) })] }), _jsxs("li", { children: ["LESS THAN OR EQUAL TO:\u00A0", _jsx("code", { children: _jsxs("strong", { children: [breakpointMap.desktop - 1, "px"] }) })] })] }), _jsx("div", { style: {
                            height: "2rem",
                            width: "100%",
                            background: shouldRenderBetween ? "green" : "#ccc"
                        } })] }), _jsx("br", {}), _jsx("br", {}), _jsxs("div", { children: ["The box should turn", " ", _jsx("span", { style: {
                            color: "red",
                            fontWeight: "bold"
                        }, children: "RED" }), " ", "when the viewport:", _jsx("ul", { children: _jsxs("li", { children: ["GREATER THAN:", " ", _jsx("code", { children: _jsxs("strong", { children: [breakpointMap.desktop, "px"] }) })] }) })] }), _jsx("br", {}), _jsx("div", { style: {
                    height: "2rem",
                    width: "100%",
                    background: shouldRenderMax ? "red" : "#ccc"
                } })] }));
};
