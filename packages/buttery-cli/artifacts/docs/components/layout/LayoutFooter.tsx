import { makeColor, makeRem } from "@buttery/tokens/docs";
import { styled } from "@linaria/react";
import type { FC } from "react";

const SLayoutFooter = styled("footer")`
  grid-area: layout-footer;
  height: ${makeRem(400)};
  background: ${makeColor("neutral", { variant: "900" })};
`;

export const LayoutFooter: FC = () => {
  return <SLayoutFooter>footer</SLayoutFooter>;
};
