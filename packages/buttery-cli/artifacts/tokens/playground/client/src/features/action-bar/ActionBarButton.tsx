import { makeRem, makeReset } from "@buttery/tokens/playground";
import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";

export type ActionBarButtonPropsNative = JSX.IntrinsicElements["button"];
export type ActionBarButtonProps = ActionBarButtonPropsNative;
const SButton = styled("button")`
  ${makeReset("button")};
  width: ${makeRem(36)};
  height: ${makeRem(36)};
  display: grid;
  place-content: center;

  & > div {
    width: ${makeRem(18)};
    height: ${makeRem(18)};
  }
`;

export const ActionBarButton = forwardRef<
  HTMLButtonElement,
  ActionBarButtonProps
>(function ActionBarButton({ children, className, ...restProps }, ref) {
  return (
    <SButton {...restProps} className={clsx(className)} ref={ref}>
      <div>{children}</div>
    </SButton>
  );
});
