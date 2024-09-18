import { jsx as _jsx } from "react/jsx-runtime";
import { css } from "@linaria/core";
import { useCallback, useEffect, } from "react";
import { classes } from "../../utils";
const divCSS = css `
  opacity: 0;
  transition: all 0.15s ease-in-out;
  padding: 0;
  border: none;

  &.open {
    opacity: 1;
  }

  &:popover-open {
    position: fixed;
    inset: unset;
    right: 32px;
    bottom: 0;
    margin: 0;
    inset-inline-start: unset;
  }
`;
export const Toast = ({ children, id }) => {
    const ref = useCallback((node) => {
        if (!node)
            return;
        node.popover = "manual";
        // @ts-expect-error open is a valid item
        node.open = true;
        node.showPopover();
        node.classList.add("open");
    }, []);
    useEffect(() => {
        if (typeof window === "undefined")
            return;
        const allToasts = document.querySelectorAll(".toast");
        for (let i = allToasts.length - 1; i >= 0; i--) {
            const toast = allToasts[i];
            const nextToastsHeight = Array.from(allToasts)
                .slice(i + 1)
                .reduce((acc, curr) => acc + curr.clientHeight + 32, 32);
            toast.style.bottom = `${nextToastsHeight}px`;
        }
    }, []);
    return (_jsx("div", { ref: ref, className: classes("toast", divCSS), id: id, children: children }));
};
