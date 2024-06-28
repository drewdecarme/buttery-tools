import { styled } from "@linaria/react";
import { makeColor, makeRem } from "#buttery/tokens/playground";
import { useColorContext } from "./Color.context";

const SPre = styled("pre")`
  background: ${makeColor("neutral", { variant: "50" })};
  font-size: ${makeRem(12)};
  padding: ${makeRem(4)};
`;

export function ColorJSON() {
  const { state } = useColorContext();

  return <SPre>{JSON.stringify(state, null, 2)}</SPre>;
}
