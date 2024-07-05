import {
  Toaster as ButteryToaster,
  useToast as useButteryToast,
} from "@buttery/components";
import { styled } from "@linaria/react";
import type { FC } from "react";
import { makeColor, makeFontFamily, makeRem } from "#buttery/tokens/playground";

export type ToastOptions = {
  variant: "success" | "error";
  message: string;
};

const SDiv = styled("div")`
  width: ${makeRem(400)};
  padding: ${makeRem(16)};
  border-radius: ${makeRem(8)};
  font-family: ${makeFontFamily("body")};

  &.success {
    background-color: ${makeColor("primary", { opacity: 0.2 })};
    border: ${makeColor("primary")};
  }

  &.error {
    background-color: ${makeColor("danger", { opacity: 0.2 })};
    border: ${makeColor("danger")};
  }
`;

const ToastComponent: FC<ToastOptions> = (props) => {
  return <SDiv className={props.variant}>{props.message}</SDiv>;
};

export const useToast = () => {
  return useButteryToast<ToastOptions>();
};

export const Toaster = () => {
  return <ButteryToaster<ToastOptions> ToastComponent={ToastComponent} />;
};
