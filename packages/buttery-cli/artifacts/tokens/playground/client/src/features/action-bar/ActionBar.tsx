import { makeRem } from "@buttery/tokens/docs";
import { styled } from "@linaria/react";
import { ActionBarActionSave } from "./ActionBarActionSave";
import { ActionBarActionVersionHistory } from "./ActionBarActionVersionHistory";

const SDiv = styled("div")`
  display: flex;
  align-items: center;
  gap: ${makeRem(16)};
`;

export function ActionBar() {
  return (
    <SDiv>
      <ActionBarActionVersionHistory />
      <ActionBarActionSave />
    </SDiv>
  );
}
