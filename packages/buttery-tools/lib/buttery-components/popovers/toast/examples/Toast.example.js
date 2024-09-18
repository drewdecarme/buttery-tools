import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
    background-color: #9aff9a;
  }

  &.error {
    background-color: #ffa3a3;
  }
`;
const ToastComponent = (props) => {
    return _jsx("div", { className: classes(divCSS, props.variant), children: props.message });
};
export default () => {
    const { create } = useToast();
    const createRandomToast = useCallback(() => {
        create({
            variant: randBoolean() ? "success" : "error",
            message: randSentence({ length: 1 }).toString(),
        });
    }, [create]);
    return (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", onClick: createRandomToast, children: "Create toast" }), _jsx(Toaster, { ToastComponent: ToastComponent })] }));
};
