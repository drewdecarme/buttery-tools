import { makeFontWeight, makeRem } from "@buttery/tokens/playground";
import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";

export type InputLabelPropsNative = JSX.IntrinsicElements["label"];
// export type InputLabelPropsCustom = {};
export type InputLabelProps = InputLabelPropsNative;

const SLabel = styled("label")`
  cursor: pointer;

  & > div {
    font-weight: ${makeFontWeight("semi-bold")};
    font-size: ${makeRem(12)};
  }

  & > input[type="text"] {
    margin-top: ${makeRem(4)};
  }
`;

export const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
  function InputLabel({ children, className, ...restProps }, ref) {
    return (
      <SLabel {...restProps} className={clsx(className)} ref={ref}>
        {children}
      </SLabel>
    );
  }
);
