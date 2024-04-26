import { FC, ReactNode } from "react";
import { Responsive } from "./Responsive";

export const ResponsiveMobile: FC<{ children: ReactNode }> = ({ children }) => {
  return <Responsive to="tablet">{children}</Responsive>;
};
