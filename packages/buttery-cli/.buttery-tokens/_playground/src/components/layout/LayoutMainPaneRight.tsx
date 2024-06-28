import { styled } from "@linaria/react";
import { makeColor, makeRem } from "#buttery/tokens/playground";
import { LayoutMainPane } from "./LayoutMainPane";

export const LayoutMainPaneRight = styled(LayoutMainPane)`
  border-left: ${makeRem(1)} solid ${makeColor("neutral", { variant: "50" })};
`;
