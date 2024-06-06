import { styled } from "@linaria/react";
import { localTokens } from "playground/src/tokens/tokens-local";
import { useColorContext } from "./Color.context";

const SPre = styled("pre")`
  background: ${localTokens.makeColor("neutral", { variant: "50" })};
  font-size: ${localTokens.makeRem(12)};
  padding: ${localTokens.makeRem(4)};
`;

export function ColorJSON() {
  const { state } = useColorContext();

  return <SPre>{JSON.stringify(state, null, 2)}</SPre>;
}
