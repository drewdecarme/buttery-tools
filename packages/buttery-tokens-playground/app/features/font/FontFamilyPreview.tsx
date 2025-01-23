import { css } from "@linaria/core";
import type { ReactNode } from "react";

import { LayoutConfigSectionPreview } from "~/components/LayoutConfigSectionPreview";
import { LayoutConfigSectionTitle } from "~/components/LayoutConfigSectionTitle";

import { FontFamilyPreviewProvider } from "./FontFamilyPreview.context";
import { FontFamilyPreviewControls } from "./FontFamilyPreviewControls";

const styles = css`
  background: white;

  .title {
    justify-content: flex-end;
  }
`;

function FontFamilyPreviewContent({ children }: { children: ReactNode }) {
  return (
    <LayoutConfigSectionPreview className={styles}>
      <LayoutConfigSectionTitle>
        <FontFamilyPreviewControls />
      </LayoutConfigSectionTitle>
      {children}
    </LayoutConfigSectionPreview>
  );
}

export function FontFamilyPreview({ children }: { children: ReactNode }) {
  return (
    <FontFamilyPreviewProvider>
      <FontFamilyPreviewContent>{children}</FontFamilyPreviewContent>
    </FontFamilyPreviewProvider>
  );
}
