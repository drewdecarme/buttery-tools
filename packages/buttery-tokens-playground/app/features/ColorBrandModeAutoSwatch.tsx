import { useCallback } from "react";
import type { ChangeEventHandler, MouseEventHandler } from "react";
import type { ColorVariantTypes } from "@buttery/tokens-utils/schemas";
import { exhaustiveMatchGuard } from "@buttery/utils/isomorphic";

import { ColorSwatch } from "./ColorSwatch";
import type { ConfigurationStateColorBrandColorsAuto } from "./config.utils";
import type { ConfigurationContextType } from "./Config.context";
import type { ColorSwatchVariantsPropsCustom } from "./ColorSwatchVariants";
import { ColorSwatchVariants } from "./ColorSwatchVariants";
import { ColorSwatchHue } from "./ColorSwatchHue";

export function ColorBrandModeAutoSwatch<
  T extends ConfigurationStateColorBrandColorsAuto
>({
  colorDef,
  setColor,
}: {
  colorDef: T;
  setColor: ConfigurationContextType["setColor"];
}) {
  const [id, { name, hue, variants }] = Object.entries(colorDef)[0];

  const handleChangeHue = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => {
      setColor((draft) => {
        const color = draft.brand.auto.colors[id];
        color.hue = Number(value);
      });
    },
    [id, setColor]
  );

  const handleChangeName = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => {
      setColor((draft) => {
        const color = draft.brand.auto.colors[id];
        color.name = value;
      });
    },
    [id, setColor]
  );

  const handleRemove = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    setColor((draft) => {
      delete draft.brand.auto.colors[id];
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
            draft.brand.auto.colors[id].variants = 10;
          });
          break;
        case "auto-named":
          setColor((draft) => {
            draft.brand.auto.colors[id].variants = ["light", "dark"];
          });
          break;
        case "key-value":
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
        draft.brand.auto.colors[id].variants = variant;
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
            const variants = draft.brand.auto.colors[id].variants;
            if (!Array.isArray(variants)) return;
            variants[params.index] = params.value;
          });
          break;

        case "add":
          setColor((draft) => {
            const variants = draft.brand.auto.colors[id].variants;
            if (!Array.isArray(variants)) return;
            variants.push(params.newValue);
          });
          break;

        case "remove":
          setColor((draft) => {
            const variants = draft.brand.auto.colors[id].variants;
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
        // only handle the number and array
        if (typeof variants === "number" || Array.isArray(variants)) {
          draft.brand.auto.colors[id].variants = variants;
        }
      });
    },
    [id, setColor]
  );

  return (
    <ColorSwatch dxOnRemove={handleRemove}>
      <ColorSwatchHue
        id={id}
        hue={hue}
        name={name}
        onChangeHue={handleChangeHue}
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
