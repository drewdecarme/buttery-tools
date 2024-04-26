import { FC, ReactNode } from "react";
import { Responsive } from "./Responsive";

export const ResponsiveDesktop: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <Responsive from="desktop">{children}</Responsive>;
};
