import { css } from "@linaria/core";
import type { ReactNode } from "react";

import { LayoutConfigSectionPreview } from "~/components/LayoutConfigSectionPreview";
import { LayoutConfigSectionTitle } from "~/components/LayoutConfigSectionTitle";

import { SpacePreviewProvider } from "./SpacePreview.context";
import { SpacePreviewControls } from "./SpacePreviewControls";

const styles = css`
  background: white;
  .title {
    justify-content: flex-end;
  }
`;

export function SpacePreviewContent({ children }: { children: ReactNode }) {
  return (
    <LayoutConfigSectionPreview className={styles}>
      <LayoutConfigSectionTitle>
        <SpacePreviewControls />
      </LayoutConfigSectionTitle>
      {children}
    </LayoutConfigSectionPreview>
  );
}

export function SpacePreview({ children }: { children: ReactNode }) {
  return (
    <SpacePreviewProvider>
      <SpacePreviewContent>{children}</SpacePreviewContent>
    </SpacePreviewProvider>
  );
}
