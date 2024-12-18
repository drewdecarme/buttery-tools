import { Button } from "~/components/Button";
import { IconFloppyDisk } from "~/icons/IconFloppyDisk";

export function ConfigSave() {
  return (
    <>
      <Button
        dxVariant="outlined"
        DXAdornmentStart={<IconFloppyDisk dxSize={16} />}
      >
        Save
      </Button>
    </>
  );
}
