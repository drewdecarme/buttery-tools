import { useCallback } from "react";
import type { ChangeEventHandler, MouseEventHandler } from "react";

import { ConfigColorSwatchHex } from "./ConfigColorSwatchHex";
import { ColorSwatch } from "./ColorSwatch";
import type { ConfigurationStateColorBrandColorsManual } from "./config.utils";
import type { ConfigurationContextType } from "./Config.context";
import { ColorSwatchVariants } from "./ConfigColorSwatchVariants";

export function ConfigColorBrandModeManualSwatch<
  T extends ConfigurationStateColorBrandColorsManual
>({
  colorDef,
  setColor,
}: {
  colorDef: T;
  setColor: ConfigurationContextType["setColor"];
}) {
  const [id, { name, hex, variants }] = Object.entries(colorDef)[0];

  const handleChangeHex = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => {
      setColor((draft) => {
        const color = draft.brand.manual[id];
        color.hex = value;
      });
    },
    [id, setColor]
  );

  const handleChangeName = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => {
      setColor((draft) => {
        const color = draft.brand.manual[id];
        color.name = value;
      });
    },
    [id, setColor]
  );

  const handleRemove = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    setColor((draft) => {
      delete draft.brand.manual[id];
    });
  }, [id, setColor]);

  return (
    <ColorSwatch dxOnRemove={handleRemove}>
      <ConfigColorSwatchHex
        id={id}
        hex={hex}
        name={name}
        onChangeHex={handleChangeHex}
        onChangeName={handleChangeName}
      />
      <ColorSwatchVariants dxVariants={variants} />
    </ColorSwatch>
  );
}
