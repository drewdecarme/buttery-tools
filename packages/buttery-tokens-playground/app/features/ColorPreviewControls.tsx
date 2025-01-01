import { css } from "@linaria/core";

import { Button } from "~/components/Button";
import { LayoutConfigSectionTitle } from "~/components/LayoutConfigSectionTitle";
import { IconMoon2 } from "~/icons/IconMoon2";

const styles = css`
  justify-content: flex-end;
`;

export function ColorPreviewControls() {
  return (
    <LayoutConfigSectionTitle className={styles}>
      <Button
        dxVariant="icon"
        DXIcon={IconMoon2}
        dxStyle="outlined"
        dxSize="normal"
        dxHelp="Split view into light & dark"
      />
    </LayoutConfigSectionTitle>
  );
}
