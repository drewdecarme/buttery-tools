import { css } from "@linaria/core";
import type { ReactNode } from "react";

import { LayoutConfigSectionPreview } from "~/components/LayoutConfigSectionPreview";
import { LayoutConfigSectionTitle } from "~/components/LayoutConfigSectionTitle";

import { CustomPreviewProvider } from "./CustomPreview.context";
import { CustomPreviewControls } from "./CustomPreviewControls";

const styles = css`
  background: white;
  .title {
    justify-content: flex-end;
  }
`;

function CustomPreviewContent({ children }: { children: ReactNode }) {
  return (
    <LayoutConfigSectionPreview className={styles}>
      <LayoutConfigSectionTitle>
        <CustomPreviewControls />
      </LayoutConfigSectionTitle>
      {children}
    </LayoutConfigSectionPreview>
  );
}

export function CustomPreview({ children }: { children: ReactNode }) {
  return (
    <CustomPreviewProvider>
      <CustomPreviewContent>{children}</CustomPreviewContent>
    </CustomPreviewProvider>
  );
}
