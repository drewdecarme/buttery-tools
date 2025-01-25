import type { MetaFunction } from "react-router";

import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { SettingsConfig } from "~/features/settings/SettingsConfig";
import { SettingsPreview } from "~/features/settings/SettingsPreview";
import { SettingsPreviewContent } from "~/features/settings/SettingsPreviewContent";

export const meta: MetaFunction = () => {
  return [
    { title: "Settings | Tokens Studio" },
    {
      name: "description",
      content:
        "Define the specifics of how the utilities can be imported and subsequently used",
    },
  ];
};

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
