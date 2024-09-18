import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { css } from "@linaria/core";
import { randBoolean, randSentence } from "@ngneat/falso";
import { useCallback } from "react";
import { classes } from "../../../utils";
import { Toaster } from "../Toaster";
import { useToast } from "../toast.useToast";
const divCSS = css `
  width: 400px;
  padding: 16px;
  border-radius: 8px;
  font-family: "Source Sans 3";

  &.success {
    background-color: #9addff;
  }

  &.error {
    background-color: #ffa2e9;
  }
`;
const toasterId = "best-practice-toaster";
// define the custom toast component
const MyToastComponent = (props) => {
    return (_jsxs("div", { className: classes(divCSS, props.variant), children: [props.message, _jsx("button", { type: "button", onClick: props.closeToast, children: "close" })] }));
};
// re-define the Toaster component custom props
export const MyToaster = () => {
    return _jsx(Toaster, { id: toasterId, ToastComponent: MyToastComponent });
};
// re-defined the useToast hook with custom props
export const useMyToast = () => {
    return useToast({ id: toasterId });
};
export default () => {
    const { create } = useMyToast();
    const createRandomToast = useCallback(() => {
        create({
            variant: randBoolean() ? "success" : "error",
            message: randSentence({ length: 1 }).toString(),
        });
    }, [create]);
    return (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", onClick: createRandomToast, children: "Create toast" }), _jsx(MyToaster, {})] }));
};
