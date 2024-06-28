import { styled } from "@linaria/react";
import { makeColor, makeRem } from "#buttery/tokens/playground";
import { LayoutMainPane } from "./LayoutMainPane";

export const LayoutMainPaneLeft = styled(LayoutMainPane)`
  border-right: ${makeRem(1)} solid ${makeColor("neutral", { variant: "50" })};
`;
