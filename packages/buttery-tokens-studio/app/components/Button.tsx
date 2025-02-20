import { forwardRef } from "react";
import { exhaustiveMatchGuard } from "@buttery/components";

import { ButtonRegular, type ButtonRegularProps } from "./ButtonRegular";
import type { ButtonIconProps } from "./ButtonIcon";
import { ButtonIcon } from "./ButtonIcon";

export type ButtonPropsCustom = ButtonRegularProps | ButtonIconProps;
export type ButtonProps = ButtonPropsCustom;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    switch (props.dxVariant) {
      case "contained":
      case "outlined":
      case "text":
        return <ButtonRegular ref={ref} {...props} />;

      case "icon":
        return <ButtonIcon ref={ref} {...props} />;

      default:
        return exhaustiveMatchGuard(props);
    }
  }
);
