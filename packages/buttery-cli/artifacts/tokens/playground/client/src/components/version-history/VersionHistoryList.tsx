import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { makeReset } from "#buttery/tokens/playground";

export type VersionHistoryListPropsNative = JSX.IntrinsicElements["ol"];
export type VersionHistoryListProps = VersionHistoryListPropsNative;

const SOl = styled("ol")`
  ${makeReset("ul")};
  counter-reset: list-counter;
`;

export const VersionHistoryList = forwardRef<
  HTMLOListElement,
  VersionHistoryListProps
>(function VersionHistoryList({ children, className, ...restProps }, ref) {
  return (
    <SOl {...restProps} className={clsx(className)} ref={ref}>
      {children}
    </SOl>
  );
});
