import type { Meta } from "@storybook/react";

import { IconCopy } from "~/icons/IconCopy";
import { IconDownload05 } from "~/icons/IconDownload05";
import { IconFloppyDisk } from "~/icons/IconFloppyDisk";

import { ButtonGroup } from "./ButtonGroup";
import { Button } from "./Button";
import { ButtonDropdown } from "./ButtonDropdown";

const meta: Meta = {
  title: "ButtonGroup",
  component: ButtonGroup,
};

export default meta;

export const WithDropdownAtEnd = () => {
  return (
    <ButtonGroup>
      <Button dxVariant="outlined" DXAdornmentStart={<IconCopy dxSize={16} />}>
        Copy
      </Button>
      <Button
        dxVariant="outlined"
        DXAdornmentStart={<IconDownload05 dxSize={16} />}
      >
        Export
      </Button>
      <ButtonDropdown
        dxVariant="outlined"
        DXAdornmentStart={<IconFloppyDisk dxSize={16} />}
        dxOptions={[
          {
            dxLabel: "Compare and Save",
            dxAction: () => {
              void 0;
            },
          },
        ]}
      >
        Save
      </ButtonDropdown>
    </ButtonGroup>
  );
};

export const WithDropdownInMiddle = () => {
  return (
    <ButtonGroup>
      <Button dxVariant="outlined" DXAdornmentStart={<IconCopy dxSize={16} />}>
        Copy
      </Button>
      <ButtonDropdown
        dxVariant="outlined"
        DXAdornmentStart={<IconFloppyDisk dxSize={16} />}
        dxOptions={[
          {
            dxLabel: "Compare and Save",
            dxAction: () => {
              void 0;
            },
          },
        ]}
      >
        Save
      </ButtonDropdown>
      <Button
        dxVariant="outlined"
        DXAdornmentStart={<IconDownload05 dxSize={16} />}
      >
        Export
      </Button>
    </ButtonGroup>
  );
};

export const WithDropdownAtStart = () => {
  return (
    <ButtonGroup>
      <ButtonDropdown
        dxVariant="outlined"
        DXAdornmentStart={<IconFloppyDisk dxSize={16} />}
        dxOptions={[
          {
            dxLabel: "Compare and Save",
            dxAction: () => {
              void 0;
            },
          },
        ]}
      >
        Save
      </ButtonDropdown>
      <Button dxVariant="outlined" DXAdornmentStart={<IconCopy dxSize={16} />}>
        Copy
      </Button>

      <Button
        dxVariant="outlined"
        DXAdornmentStart={<IconDownload05 dxSize={16} />}
      >
        Export
      </Button>
    </ButtonGroup>
  );
};
