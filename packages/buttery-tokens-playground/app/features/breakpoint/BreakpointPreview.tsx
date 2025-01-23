import { css } from "@linaria/core";
import type { ReactNode } from "react";

import { LayoutConfigSectionPreview } from "~/components/LayoutConfigSectionPreview";
import { LayoutConfigSectionTitle } from "~/components/LayoutConfigSectionTitle";

import { BreakpointPreviewProvider } from "./BreakpointPreview.context";
import { BreakpointPreviewControls } from "./BreakpointPreviewControls";

const styles = css`
  background: white;
  .title {
    justify-content: flex-end;
  }
`;

function BreakpointPreviewContent({ children }: { children: ReactNode }) {
  return (
    <LayoutConfigSectionPreview className={styles}>
      <LayoutConfigSectionTitle>
        <BreakpointPreviewControls />
      </LayoutConfigSectionTitle>
      {children}
    </LayoutConfigSectionPreview>
  );
}

export function BreakpointPreview({ children }: { children: ReactNode }) {
  return (
    <BreakpointPreviewProvider>
      <BreakpointPreviewContent>{children}</BreakpointPreviewContent>
    </BreakpointPreviewProvider>
  );
}
