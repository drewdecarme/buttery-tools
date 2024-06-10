import { makeRem } from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import type { FC, ReactNode } from "react";

const SLayoutMain = styled("main")`
  grid-area: layout-main;
  padding: ${makeRem(32)} ${makeRem(48)};
  max-width: 60ch;
`;

export const LayoutMain: FC<{ children: ReactNode }> = ({ children }) => {
  return <SLayoutMain>{children}</SLayoutMain>;
};
