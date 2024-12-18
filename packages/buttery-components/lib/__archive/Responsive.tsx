import {
  type BreakpointFromTo,
  useBreakpoint,
} from "@BUTTERY_COMPONENT/__archive/hook.useBreakpoint";
import type { FC, ReactNode } from "react";

export const Responsive: FC<{ children: ReactNode } & BreakpointFromTo> = ({
  children,
  from,
  to,
}) => {
  const shouldRender = useBreakpoint({ from, to });
  if (!shouldRender) return null;
  return children;
};
