import { FC, ReactNode } from "react";
import { Responsive } from "./Responsive";

export const ResponsiveTablet: FC<{ children: ReactNode }> = ({ children }) => {
  return <Responsive from="tablet">{children}</Responsive>;
};
