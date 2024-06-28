import type { FC, ReactNode } from "react";

export type TabProps = {
  btLabel: string;
  btId: string;
  children: ReactNode;
};
export const Tab: FC<TabProps> = ({ children }) => {
  return children;
};
