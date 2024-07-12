import {
  makeColor,
  makeFontFamily,
  makeFontWeight,
  makeRem,
} from "@buttery/tokens/playground";
import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { dateify } from "../../utils";

export type VersionHistoryListItemPropsNative = JSX.IntrinsicElements["li"];
export type VersionHistoryListItemPropsCustom = {
  dxDate: string | null;
  dxTitle: string;
};
export type VersionHistoryListItemProps = VersionHistoryListItemPropsNative &
  VersionHistoryListItemPropsCustom;

const SLi = styled("li")`
  position: relative;

  && {
    height: ${makeRem(92)};
    padding-left: ${makeRem(48)};
    font-family: ${makeFontFamily("body")};
    font-size: ${makeRem(14)};
    display: flex;
    align-items: center;
  }

  .title {
    font-size: ${makeRem(16)};
    font-weight: ${makeFontWeight("semi-bold")};
  }

  &::before {
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
  { children, className, dxDate, dxTitle, ...restProps },
  ref
) {
  return (
    <SLi {...restProps} className={clsx(className)} ref={ref}>
      <div>
        <div className="title">{dxTitle}</div>
        <div>
          {dateify.format(dxDate ?? undefined, { format: "6/17/20 9:42 AM" })}
        </div>
        {children}
      </div>
    </SLi>
  );
});
