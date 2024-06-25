import { styled } from "@linaria/react";
import { localTokens } from "playground/src/tokens/tokens-local";
import { LayoutMainPane } from "./LayoutMainPane";

export const LayoutMainPaneLeft = styled(LayoutMainPane)`
  border-right: ${localTokens.makeRem(1)} solid
    ${localTokens.makeColor("neutral", { variant: "50" })};
`;
