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

const SPane = styled("article")`
  padding: 0 ${localTokens.makeRem(32)};
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

export const ConfigColor: FC = () => {
  return (
    <ConfigColorProvider>
      <SDiv>
        <SPane>
          <SH3>Color</SH3>
          <p>
            Donec ullamcorper nulla non metus auctor fringilla. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Duis mollis, est non
            commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem
            nec elit. Donec id elit non mi porta gravida at eget metus. Donec
            sed odio dui. Praesent commodo cursus magna, vel scelerisque nisl
            consectetur et. Fusce dapibus, tellus ac cursus commodo, tortor
            mauris condimentum nibh, ut fermentum massa justo sit amet risus.
          </p>
          <ConfigColorSelectMode />
          <ConfigColorMode />
          <ConfigColorJSON />
        </SPane>
        <SPreview>
          <ConfigColorPalette />
        </SPreview>
      </SDiv>
    </ConfigColorProvider>
  );
};
