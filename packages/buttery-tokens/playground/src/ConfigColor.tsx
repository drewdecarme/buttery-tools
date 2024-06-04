import { styled } from "@linaria/react";
import type { FC } from "react";
import { ConfigColorProvider } from "./ConfigColor.context";
import { ConfigColorJSON } from "./ConfigColorJSON";
import { ConfigColorMode } from "./ConfigColorMode";
import { ConfigColorPalette } from "./ConfigColorPalette";
import { ConfigColorSelectMode } from "./ConfigColorSelectMode";
import { localTokens } from "./tokens-local";

const SDiv = styled("div")`
  display: grid;
  gap: ${localTokens.makeRem(16)};
  grid-template-columns: ${localTokens.makeRem(300)} 1fr ${localTokens.makeRem(
    300
  )};
  width: 100%;
`;

const SPane = styled("article")`
  padding: 0 ${localTokens.makeRem(32)};
  border-right: ${localTokens.makeRem(1)} solid ${localTokens.makeColor(
    "neutral",
    { variant: "50" }
  )};
`;

const SH3 = styled("h2")`
  font-family: ${localTokens.makeFontFamily("body")};
  font-size: ${localTokens.makeRem(16)};
  text-transform: uppercase;
  & + p {
    font-size: ${localTokens.makeRem(12)};
  }
`;

const SPreview = styled("div")`
  padding: ${localTokens.makeRem(16)};
`;

const SDetail = styled("div")`
  padding: ${localTokens.makeRem(16)};
  border-left: ${localTokens.makeRem(1)} solid ${localTokens.makeColor(
    "neutral",
    { variant: "50" }
  )};
`;
export const ConfigColor: FC = () => {
  return (
    <ConfigColorProvider>
      <SDiv>
        <SPane>
          <SH3>Color</SH3>

          <ConfigColorSelectMode />
          <ConfigColorMode />
        </SPane>
        <SPreview>
          <ConfigColorPalette />
        </SPreview>
        <SDetail>
          <ConfigColorJSON />
        </SDetail>
      </SDiv>
    </ConfigColorProvider>
  );
};
