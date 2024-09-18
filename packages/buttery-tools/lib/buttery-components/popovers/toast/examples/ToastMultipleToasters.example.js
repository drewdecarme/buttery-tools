import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { css } from "@linaria/core";
import { randBoolean, randProductDescription, randSentence, } from "@ngneat/falso";
import { classes } from "../../../utils";
import { Toaster } from "../Toaster";
import { useToast } from "../toast.useToast";
const divCSS = css `
  width: 400px;
  padding: 16px;
  border-radius: 8px;
  font-family: "Source Sans 3";

  &.success {
    background-color: #9aff9d;
  }

  &.error {
    background-color: #ee9e9e;
  }

  &.info {
    background-color: #9addff;
  }

  &.warning {
    background-color: #b1a2ff;
  }
`;
const componentsToasterId = "components-toaster";
export const useComponentsToast = () => {
    return useToast({ id: componentsToasterId });
};
export const ComponentsToaster = () => {
    return (_jsx(Toaster, { id: componentsToasterId, ToastComponent: (props) => (_jsxs("div", { className: classes(divCSS, props.variant), children: [_jsx("h4", { children: "Components Toast" }), props.message, _jsx("button", { type: "button", onClick: props.closeToast, children: "close" })] })) }));
};
const featuresToasterId = "features-toaster";
export const useFeaturesToast = () => {
    return useToast({ id: featuresToasterId });
};
export const FeaturesToaster = () => {
    return (_jsx(Toaster, { id: featuresToasterId, ToastComponent: (props) => (_jsxs("div", { className: classes(divCSS, props.variant), children: [_jsx("h4", { children: "Features Toast" }), _jsxs("h5", { children: ["Product: ", props.feature] }), props.message, _jsx("button", { type: "button", onClick: props.closeToast, children: "close" })] })) }));
};
export default () => {
    const { create: createComponentsToast } = useComponentsToast();
    const { create: createFeaturesToast } = useFeaturesToast();
    return (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", onClick: () => createComponentsToast({
                    variant: randBoolean() ? "success" : "error",
                    message: randSentence({ length: 1 }).toString(),
                }), children: "Create \"Components\" toast" }), _jsx(ComponentsToaster, {}), _jsx("button", { type: "button", onClick: () => createFeaturesToast({
                    variant: randBoolean() ? "info" : "warning",
                    feature: randProductDescription(),
                    message: randSentence({ length: 1 }).toString(),
                }), children: "Create \"Features\" toast" }), _jsx(FeaturesToaster, {})] }));
};
