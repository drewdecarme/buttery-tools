import { useCallback } from "react";
import type { ChangeEventHandler, MouseEventHandler } from "react";
import type { ColorVariantTypes } from "@buttery/tokens-utils/schemas";
import { exhaustiveMatchGuard } from "@buttery/utils/isomorphic";

import { ColorSwatchHex } from "./ColorSwatchHex";
import { ColorSwatch } from "./ColorSwatch";
import type { ConfigurationStateColorBrandColorsManual } from "./config.utils";
import type { ConfigurationContextType } from "./Config.context";
import type { ColorSwatchVariantsPropsCustom } from "./ColorSwatchVariants";
import { ColorSwatchVariants } from "./ColorSwatchVariants";

export function ColorBrandModeManualSwatch<
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

  const handleChangeVariantType = useCallback<
    ChangeEventHandler<HTMLSelectElement>
  >(
    ({ currentTarget: { value } }) => {
      const type = value as ColorVariantTypes["type"];
      switch (type) {
        case "auto":
          setColor((draft) => {
            draft.brand.manual[id].variants = 10;
          });
          break;
        case "auto-named":
          setColor((draft) => {
            draft.brand.manual[id].variants = ["light", "dark"];
          });
          break;
        case "key-value":
          setColor((draft) => {
            draft.brand.manual[id].variants = {
              light: "#cccccc",
              dark: "#525252",
            };
          });
          break;

        default:
          exhaustiveMatchGuard(type);
      }
    },
    [id, setColor]
  );

  const handleChangeVariantAuto = useCallback<
    ColorSwatchVariantsPropsCustom["onChangeVariantAuto"]
  >(
    (variant) => {
      setColor((draft) => {
        draft.brand.manual[id].variants = variant;
      });
    },
    [id, setColor]
  );

  const handleChangeVariantNamed = useCallback<
    ColorSwatchVariantsPropsCustom["onChangeVariantNamed"]
  >(
    (params) => {
      switch (params.mode) {
        case "change":
          setColor((draft) => {
            const variants = draft.brand.manual[id].variants;
            if (!Array.isArray(variants)) return;
            variants[params.index] = params.value;
          });
          break;

        case "add":
          setColor((draft) => {
            const variants = draft.brand.manual[id].variants;
            if (!Array.isArray(variants)) return;
            variants.push(params.newValue);
          });
          break;

        case "remove":
          setColor((draft) => {
            const variants = draft.brand.manual[id].variants;
            if (!Array.isArray(variants)) return;
            variants.splice(params.index, 1);
          });
          break;

        default:
          exhaustiveMatchGuard(params);
      }
    },
    [id, setColor]
  );

  const handleChangeVariantManual = useCallback<
    ColorSwatchVariantsPropsCustom["onChangeVariantManual"]
  >(
    (variants) => {
      setColor((draft) => {
        draft.brand.manual[id].variants = variants;
      });
    },
    [id, setColor]
  );

  return (
    <ColorSwatch dxOnRemove={handleRemove}>
      <ColorSwatchHex
        id={id}
        hex={hex}
        name={name}
        onChangeHex={handleChangeHex}
        onChangeName={handleChangeName}
      />
      <ColorSwatchVariants
        dxVariants={variants}
        onChangeVariantType={handleChangeVariantType}
        onChangeVariantAuto={handleChangeVariantAuto}
        onChangeVariantNamed={handleChangeVariantNamed}
        onChangeVariantManual={handleChangeVariantManual}
      />
    </ColorSwatch>
  );
}
