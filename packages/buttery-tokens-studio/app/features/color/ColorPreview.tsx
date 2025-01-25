import type { ReactNode } from "react";
import { css } from "@linaria/core";
import { classes } from "@buttery/components";

import { LayoutConfigSectionPreview } from "~/components/LayoutConfigSectionPreview";
import { LayoutConfigSectionTitle } from "~/components/LayoutConfigSectionTitle";

import { ColorPreviewControls } from "./ColorPreviewControls";
import {
  ColorPreviewProvider,
  useColorPreviewContext,
} from "./ColorPreview.context";

import { colorThemeMap } from "../config.utils.color";

const styles = css`
  position: relative;

  &.light {
    background: ${colorThemeMap.light};

    &::after {
      content: "";
      position: absolute;
      left: 100%;
      top: 0;
      bottom: 0;
      width: 100vw;
      background: white;
    }
  }
  &.dark {
    background: ${colorThemeMap.dark};
  }
`;

const stylesTitle = css`
  justify-content: flex-end;
  background: inherit;
`;

function ColorPreviewContent({ children }: { children: ReactNode }) {
  const { themeMode } = useColorPreviewContext();
  return (
    <LayoutConfigSectionPreview className={classes(styles, themeMode)}>
      <LayoutConfigSectionTitle className={stylesTitle}>
        <ColorPreviewControls />
      </LayoutConfigSectionTitle>
      {children}
    </LayoutConfigSectionPreview>
  );
}

export function ColorPreview({ children }: { children: ReactNode }) {
  return (
    <ColorPreviewProvider>
      <ColorPreviewContent>{children}</ColorPreviewContent>
    </ColorPreviewProvider>
  );
}
