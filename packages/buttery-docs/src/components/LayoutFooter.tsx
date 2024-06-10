import { styled } from "@linaria/react";
import type { FC } from "react";

const SLayoutFooter = styled("main")`
  grid-area: layout-footer;
`;

export const LayoutFooter: FC = () => {
  return <SLayoutFooter>footer</SLayoutFooter>;
};
