import { styled } from "@linaria/react";
import { makeColor, makeRem } from "#buttery/tokens/config-ui";
import { LayoutMainPane } from "./LayoutMainPane";

export const LayoutMainPaneRight = styled(LayoutMainPane)`
  border-left: ${makeRem(1)} solid ${makeColor("neutral", { variant: "50" })};
`;
