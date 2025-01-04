import { InputGroup } from "~/components/InputGroup";
import { InputLabel } from "~/components/InputLabel";
import { InputNumber } from "~/components/InputNumber";
import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { LayoutConfigSectionTitle } from "~/components/LayoutConfigSectionTitle";
import { SpacePreview } from "~/features/SpacePreview";

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
          <InputGroup>
            <InputLabel
              dxLabel="Scaling factor"
              dxHelp="Multiplies the baseline grid to define scalable spacing intervals"
              dxSize="dense"
            >
              <InputNumber dxSize="dense" defaultValue={"1.5"} />
            </InputLabel>
            <InputLabel
              dxLabel="Variant count"
              dxHelp="The number of spacing variants (default: 5)"
              dxSize="dense"
            >
              <InputNumber dxSize="dense" defaultValue={"5"} />
            </InputLabel>
          </InputGroup>
        </LayoutConfigSectionControls>
        <SpacePreview>test</SpacePreview>
      </LayoutConfigSection>
    </>
  );
}
