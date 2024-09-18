import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { css } from "@linaria/core";
import { useTooltip } from "../hook.useTooltip";
const tooltipCss = css `
  padding: 0.5rem 1rem;
  background: black;
  color: white;
  border: 0;
  border-radius: 0.5rem;
`;
const targetCss = css `
  border: 0;
  padding: 0;
  background: 0;
  height: 32px;
  width: 32px;
  display: grid;
  place-content: center;
  position: relative;
`;
export default () => {
    const { targetProps, tooltipProps } = useTooltip({
        id: "save",
        dxType: "tooltip",
        dxKind: "label",
        dxLabeledBy: "save",
    });
    return (_jsxs(_Fragment, { children: [_jsx("button", { ...targetProps, className: targetCss, onClick: () => alert("Saved!!"), children: "Save" }), _jsx("div", { ...tooltipProps, className: tooltipCss, children: "Save your work to the system" })] }));
};
