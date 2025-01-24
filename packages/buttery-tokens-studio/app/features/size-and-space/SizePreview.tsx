import { css } from "@linaria/core";
import type { ReactNode } from "react";

import { LayoutConfigSectionPreview } from "~/components/LayoutConfigSectionPreview";
import { LayoutConfigSectionTitle } from "~/components/LayoutConfigSectionTitle";

import { SizePreviewProvider } from "./SizePreview.context";
import { SizePreviewControls } from "./SizePreviewControls";

const styles = css`
  background: white;

  .title {
    justify-content: flex-end;
  }
`;

function SizePreviewContent({ children }: { children: ReactNode }) {
  return (
    <LayoutConfigSectionPreview className={styles}>
      <LayoutConfigSectionTitle>
        <SizePreviewControls />
      </LayoutConfigSectionTitle>
      {children}
    </LayoutConfigSectionPreview>
  );
}

export function SizePreview({ children }: { children: ReactNode }) {
  return (
    <SizePreviewProvider>
      <SizePreviewContent>{children}</SizePreviewContent>
    </SizePreviewProvider>
  );
}
