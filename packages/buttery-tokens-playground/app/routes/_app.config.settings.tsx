import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { SettingsConfig } from "~/features/settings/SettingsConfig";
import { SettingsPreview } from "~/features/settings/SettingsPreview";
import { SettingsPreviewContent } from "~/features/settings/SettingsPreviewContent";

export default function ConfigSettingsRoute() {
  return (
    <>
      <LayoutConfigSection>
        <LayoutConfigSectionControls
          dxTitle="Settings"
          dxDescription={<>explanation of settings</>}
        >
          <SettingsConfig />
        </LayoutConfigSectionControls>
        <SettingsPreview>
          <SettingsPreviewContent />
        </SettingsPreview>
      </LayoutConfigSection>
    </>
  );
}
