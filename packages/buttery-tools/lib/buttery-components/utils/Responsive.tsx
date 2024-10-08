import type { FC, ReactNode } from "react";
import { type BreakpointFromTo, useBreakpoint } from "../hooks";

export const Responsive: FC<{ children: ReactNode } & BreakpointFromTo> = ({
  children,
  from,
  to,
}) => {
  const shouldRender = useBreakpoint({ from, to });
  if (!shouldRender) return null;
  return children;
};
