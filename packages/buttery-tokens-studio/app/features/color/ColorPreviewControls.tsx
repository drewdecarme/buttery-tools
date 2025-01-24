import { Button } from "~/components/Button";
import { ButtonGroup } from "~/components/ButtonGroup";
import { IconMoon2 } from "~/icons/IconMoon2";
import { IconUniversalAccess } from "~/icons/IconUniversalAccess";
import { IconSun03 } from "~/icons/IconSun03";

import { useColorPreviewContext } from "./ColorPreview.context";

export function ColorPreviewControls() {
  const { themeMode, setThemeMode } = useColorPreviewContext();
  return (
    <ButtonGroup>
      <Button
        dxVariant="icon"
        DXIcon={IconUniversalAccess}
        dxStyle="outlined"
        dxSize="normal"
        dxHelp="View accessibility metrics"
      />
      <Button
        dxVariant="icon"
        DXIcon={themeMode === "light" ? IconMoon2 : IconSun03}
        onClick={() =>
          setThemeMode((prevState) => (prevState === "dark" ? "light" : "dark"))
        }
        dxStyle="outlined"
        dxSize="normal"
        dxHelp={`Toggle ${themeMode === "dark" ? "light" : "dark"} theme`}
      />
    </ButtonGroup>
  );
}
