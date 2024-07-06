import {
  Toaster as ButteryToaster,
  useToast as useButteryToast,
} from "@buttery/components";
import { IconComponent } from "@buttery/icons";
import { makeColor, makeFontFamily, makeRem } from "@buttery/tokens/playground";
import { styled } from "@linaria/react";
import type { FC } from "react";
import { match } from "ts-pattern";

export type ToastOptions = {
  variant: "success" | "error";
  message: string;
};

const SDiv = styled("div")`
  width: ${makeRem(400)};
  padding: ${makeRem(16)};
  border-radius: ${makeRem(8)};
  font-family: ${makeFontFamily("body")};
  font-size: ${makeRem(14)};
  display: grid;
  grid-template-columns: ${makeRem(24)} 1fr;
  gap: ${makeRem(16)};

  .icon {
    height: ${makeRem(24)};
    width: ${makeRem(24)};
  }

  &.success {
    background-color: ${makeColor("success", { opacity: 0.2 })};

    &.icon {
      color: ${makeColor("success")};
    }
  }

  &.error {
    background-color: ${makeColor("danger", { opacity: 0.2 })};

    &.icon {
      color: ${makeColor("danger")};
    }
  }
`;

const ToastComponent: FC<ToastOptions> = (props) => {
  return (
    <SDiv className={props.variant}>
      <div className="icon">
        {match(props.variant)
          .with("success", () => (
            <IconComponent icon="checkmark-circle-02-stroke-rounded" />
          ))
          .with("error", () => (
            <IconComponent icon="alert-circle-stroke-rounded" />
          ))
          .exhaustive()}
      </div>
      <div>{props.message}</div>
    </SDiv>
  );
};

export const useToast = () => {
  return useButteryToast<ToastOptions>();
};

export const Toaster = () => {
  return <ButteryToaster<ToastOptions> ToastComponent={ToastComponent} />;
};
