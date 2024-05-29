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
  grid-template-columns: ${localTokens.makeRem(300)} 1fr;
  width: 100%;
`;

export const ConfigColor: FC = () => {
  return (
    <ConfigColorProvider>
      <ConfigColorSelectMode />
      <SDiv>
        <div>
          <ConfigColorMode />
          <ConfigColorJSON />
        </div>
        <div>
          <h3>colors</h3>
          <ConfigColorPalette />
        </div>
      </SDiv>
    </ConfigColorProvider>
  );
};
