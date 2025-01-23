import { classes } from "@buttery/components";
import { makeColor, makeFontWeight, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type TableBodyCellPropsNative = JSX.IntrinsicElements["th"];
export type TableBodyCellPropsCustom = {
  dxTest?: string;
};
export type TableBodyCellProps = TableBodyCellPropsNative &
  TableBodyCellPropsCustom;

const styles = css`
  font-size: ${makeRem(16)};
  font-weight: ${makeFontWeight("Mulish-regular")};
  text-align: left;

  padding: ${makeRem(16)};
  height: ${makeRem(40)};
  vertical-align: text-top;
  border-bottom: 1px solid ${makeColor("neutral-light", { opacity: 0.1 })};

  & + & {
    border-left: 1px solid ${makeColor("neutral-light", { opacity: 0.1 })};
  }
`;

export const TableBodyCell = forwardRef<
  HTMLTableCellElement,
  TableBodyCellProps
>(function TableBodyCell({ children, className, ...restProps }, ref) {
  return (
    <th {...restProps} className={classes(styles, className)} ref={ref}>
      {children}
    </th>
  );
});
