import { IconPlusSign } from "~/icons/IconPlusSign";

import { Button } from "./Button";

export function VariantAdd(props: { children: string; onAdd: () => void }) {
  return (
    <Button
      dxVariant="text"
      dxColor="secondary"
      onClick={props.onAdd}
      DXIconStart={IconPlusSign}
    >
      {props.children}
    </Button>
  );
}
