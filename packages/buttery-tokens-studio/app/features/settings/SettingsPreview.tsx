import { css } from "@linaria/core";
import type { ReactNode } from "react";

import { LayoutConfigSectionPreview } from "~/components/LayoutConfigSectionPreview";
import { LayoutConfigSectionTitle } from "~/components/LayoutConfigSectionTitle";

import { SettingsPreviewProvider } from "./SettingsPreview.context";
import { SettingsPreviewControls } from "./SettingsPreviewControls";

const styles = css`
  background: white;
  .title {
    justify-content: flex-end;
    z-index: 10;
  }
`;

function SettingsPreviewContent({ children }: { children: ReactNode }) {
  return (
    <LayoutConfigSectionPreview className={styles}>
      <LayoutConfigSectionTitle>
        <SettingsPreviewControls />
      </LayoutConfigSectionTitle>
      {children}
    </LayoutConfigSectionPreview>
  );
}

export function SettingsPreview({ children }: { children: ReactNode }) {
  return (
    <SettingsPreviewProvider>
      <SettingsPreviewContent>{children}</SettingsPreviewContent>
    </SettingsPreviewProvider>
  );
}
