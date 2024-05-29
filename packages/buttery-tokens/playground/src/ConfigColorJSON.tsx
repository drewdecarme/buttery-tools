import { styled } from "@linaria/react";
import { useConfigColorContext } from "./ConfigColor.context";
import { localTokens } from "./tokens-local";

const SPre = styled("pre")`
    background: #ccc;
    padding: ${localTokens.makeRem(32)};
`;

export function ConfigColorJSON() {
  const { state } = useConfigColorContext();

  return (
    <>
      <div>Color config</div>
      <SPre>{JSON.stringify(state, null, 2)}</SPre>
    </>
  );
}
