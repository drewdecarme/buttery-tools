import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useTooltip } from "../hook.useTooltip";
export default () => {
    const { targetProps, tooltipProps } = useTooltip({
        id: "save",
        dxType: "tooltip",
        dxKind: "label",
        dxLabeledBy: "save",
    });
    return (_jsxs(_Fragment, { children: [_jsx("button", { ...targetProps, children: "Save" }), _jsx("div", { ...tooltipProps, children: "Save your work to the system" })] }));
};
