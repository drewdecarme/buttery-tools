import { InputGroup } from "~/components/InputGroup";
import { InputLabel } from "~/components/InputLabel";
import { InputNumber } from "~/components/InputNumber";
import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { LayoutConfigSectionTitle } from "~/components/LayoutConfigSectionTitle";
import { SpaceConfig } from "~/features/SpaceConfig";
import { SpacePreview } from "~/features/SpacePreview";
import { SpacePreviewContent } from "~/features/SpacePreviewContent";

export default function ConfigResponseRoute() {
  return (
    <>
      <LayoutConfigSection>
        <LayoutConfigSectionControls
          dxTitle="Sizing"
          dxDescription={<>explanation of sizing</>}
        >
          <InputGroup>
            <InputLabel
              dxLabel="Document Font Size"
              dxHelp="Establishes a base for consistent layout and typography scaling."
              dxSize="dense"
            >
              <InputNumber dxSize="dense" defaultValue={"16"} />
            </InputLabel>
            <InputLabel
              dxLabel="Baseline Grid"
              dxSize="dense"
              dxHelp="Harmonizes rhythm and alignment in layouts and typography."
            >
              <InputNumber dxSize="dense" defaultValue={"4"} />
            </InputLabel>
          </InputGroup>
        </LayoutConfigSectionControls>
        <SpacePreview>
          <LayoutConfigSectionTitle>test</LayoutConfigSectionTitle>
          test
        </SpacePreview>
      </LayoutConfigSection>
      <LayoutConfigSection>
        <LayoutConfigSectionControls
          dxTitle="Spacing"
          dxDescription={<>explanation of spacing</>}
        >
          <SpaceConfig />
        </LayoutConfigSectionControls>
        <SpacePreview>
          <SpacePreviewContent />
        </SpacePreview>
      </LayoutConfigSection>
    </>
  );
}
