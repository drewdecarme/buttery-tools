import { makeColor, makeRem } from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import type { FC } from "react";

const SLayoutHeader = styled("header")`
  grid-area: layout-header;
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  padding: 0 ${makeRem(32)};
  border-bottom: ${makeRem(1)} solid
    ${makeColor("neutral", { variant: "50", opacity: 0.5 })};
`;

export const LayoutHeader: FC = () => {
  return <SLayoutHeader>header</SLayoutHeader>;
};
