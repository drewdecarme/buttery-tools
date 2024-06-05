import { styled } from "@linaria/react";
import { useConfigColorContext } from "./ConfigColor.context";
import { localTokens } from "./tokens-local";

const SPre = styled("pre")`
  background: ${localTokens.makeColor("neutral", { variant: "50" })};
  font-size: ${localTokens.makeRem(12)};
  padding: ${localTokens.makeRem(4)};
`;

export function ConfigColorJSON() {
  const { state } = useConfigColorContext();

  return <SPre>{JSON.stringify(state, null, 2)}</SPre>;
}
