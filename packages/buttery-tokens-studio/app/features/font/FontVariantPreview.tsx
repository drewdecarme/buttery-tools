import { css } from "@linaria/core";
import type { ReactNode } from "react";

import { LayoutConfigSectionPreview } from "~/components/LayoutConfigSectionPreview";
import { LayoutConfigSectionTitle } from "~/components/LayoutConfigSectionTitle";

import { FontVariantPreviewProvider } from "./FontVariantPreview.context";
import { FontVariantPreviewControls } from "./FontVariantPreviewControls";

const styles = css`
  background: white;

  .title {
    justify-content: flex-end;
  }
`;

function FontVariantPreviewContent({ children }: { children: ReactNode }) {
  return (
    <LayoutConfigSectionPreview className={styles}>
      <LayoutConfigSectionTitle>
        <FontVariantPreviewControls />
      </LayoutConfigSectionTitle>
      {children}
    </LayoutConfigSectionPreview>
  );
}

export function FontVariantPreview({ children }: { children: ReactNode }) {
  return (
    <FontVariantPreviewProvider>
      <FontVariantPreviewContent>{children}</FontVariantPreviewContent>
    </FontVariantPreviewProvider>
  );
}
