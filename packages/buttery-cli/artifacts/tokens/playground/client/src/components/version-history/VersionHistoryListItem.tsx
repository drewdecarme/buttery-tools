import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { makeColor, makeFontFamily, makeRem } from "#buttery/tokens/playground";
import { dateify } from "../../utils";

export type VersionHistoryListItemPropsNative = JSX.IntrinsicElements["li"];
export type VersionHistoryListItemPropsCustom = {
  dxDate: string | null;
};
export type VersionHistoryListItemProps = VersionHistoryListItemPropsNative &
  VersionHistoryListItemPropsCustom;

const SLi = styled("li")`
  position: relative;

  && {
    height: ${makeRem(72)};
    padding-left: ${makeRem(40)};
    font-family: ${makeFontFamily("body")};
    font-size: ${makeRem(14)};
    display: flex;
    align-items: center;
  }

  &::before {
    /* content: "v" counter(list-counter);
    counter-increment: list-counter; */
    content: "v" attr(data-index);
    position: absolute;
    background: ${makeColor("neutral")};
    color: white;
    left: 0;
    font-size: ${makeRem(10)};
    border-radius: ${makeRem(12)};
    padding: ${makeRem(2)} ${makeRem(4)};
    width: ${makeRem(24)};
    text-align: center;
    z-index: 1;
  }

  &:not(:last-child) {
    &::after {
      content: "";
      position: absolute;
      border-left: ${makeRem(1)} dashed
        ${makeColor("neutral", { variant: "100" })};
      left: ${makeRem(16)};
      width: ${makeRem(1)};
      height: 100%;
      top: 50%;
    }
  }
`;

export const VersionHistoryListItem = forwardRef<
  HTMLLIElement,
  VersionHistoryListItemProps
>(function VersionHistoryListItem(
  { children, className, dxDate, ...restProps },
  ref
) {
  return (
    <SLi {...restProps} className={clsx(className)} ref={ref}>
      {dateify.format(dxDate ?? undefined, { format: "6/17/20 9:42 AM" })}
      {children}
    </SLi>
  );
});
