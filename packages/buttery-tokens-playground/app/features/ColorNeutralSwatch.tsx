import { useCallback } from "react";
import type { ChangeEventHandler, MouseEventHandler } from "react";
import type { ColorVariantTypes } from "@buttery/tokens-utils/schemas";
import { exhaustiveMatchGuard } from "@buttery/utils/isomorphic";

import { ColorBlob, useColorBlob } from "~/components/ColorBlob";
import { InputGroup } from "~/components/InputGroup";

import { ColorSwatchHex } from "./ColorSwatchHex";
import { ColorSwatch } from "./ColorSwatch";
import type { ConfigurationStateColorsManual } from "./config.utils.sizing";
import type { ConfigurationContextType } from "./Config.context";
import type { ColorSwatchVariantsPropsCustom } from "./ColorSwatchVariants";
import { ColorSwatchVariants } from "./ColorSwatchVariants";
import { ColorSwatchName } from "./ColorSwatchName";
import { ColorSwatchSummary } from "./ColorSwatchSummary";

export function ColorNeutralSwatch<T extends ConfigurationStateColorsManual>({
  colorDef,
  setColor,
}: {
  colorDef: T;
  setColor: ConfigurationContextType["setColor"];
}) {
  const [id, { name, hex, variants }] = Object.entries(colorDef)[0];
  const { colorBlobRef, setHex } = useColorBlob();

  const handleChangeHex = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => {
      setColor((draft) => {
        const color = draft.neutral[id];
        color.hex = value;
      });
      setHex(value);
    },
    [id, setColor, setHex]
  );

  const handleChangeName = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => {
      setColor((draft) => {
        const color = draft.neutral[id];
        color.name = value;
      });
    },
    [id, setColor]
  );

  const handleRemove = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    setColor((draft) => {
      delete draft.neutral[id];
    });
  }, [id, setColor]);

  const handleChangeVariantType = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      const type = value as ColorVariantTypes["type"];
      switch (type) {
        case "auto":
          setColor((draft) => {
            draft.neutral[id].variants = 10;
          });
          break;
        case "auto-named":
          setColor((draft) => {
            draft.neutral[id].variants = ["light", "dark"];
          });
          break;
        case "key-value":
          setColor((draft) => {
            draft.neutral[id].variants = {
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
        draft.neutral[id].variants = variant;
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
            const variants = draft.neutral[id].variants;
            if (!Array.isArray(variants)) return;
            variants[params.index] = params.value;
          });
          break;

        case "add":
          setColor((draft) => {
            const variants = draft.neutral[id].variants;
            if (!Array.isArray(variants)) return;
            variants.push(params.newValue);
          });
          break;

        case "remove":
          setColor((draft) => {
            const variants = draft.neutral[id].variants;
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
        draft.neutral[id].variants = variants;
      });
    },
    [id, setColor]
  );

  return (
    <ColorSwatch dxOnRemove={handleRemove}>
      <ColorSwatchSummary dxTitle={name} dxSubtitle={`Hex: ${hex}`}>
        <ColorBlob
          ref={colorBlobRef}
          dxVariant="circle"
          dxType="hex"
          dxValue={hex}
        />
      </ColorSwatchSummary>
      <div>
        <InputGroup>
          <ColorSwatchName name={name} onChangeName={handleChangeName} />
          <ColorSwatchHex id={id} hex={hex} onChangeHex={handleChangeHex} />
          <ColorSwatchVariants
            dxVariants={variants}
            onChangeVariantType={handleChangeVariantType}
            onChangeVariantAuto={handleChangeVariantAuto}
            onChangeVariantNamed={handleChangeVariantNamed}
            onChangeVariantManual={handleChangeVariantManual}
          />
        </InputGroup>
        {/* <ColorSwatchTabs dxInitActiveTab="light-theme">
          <ul>
            <li>
              <NavTab id="light-theme">
                <NavTabLabel>Light Theme</NavTabLabel>
                <NavTabContent>
                  <InputGroup>
                    <ColorSwatchHex
                      id={id}
                      hex={hex}
                      onChangeHex={handleChangeHex}
                    />
                    <ColorSwatchVariants
                      dxVariants={variants}
                      onChangeVariantType={handleChangeVariantType}
                      onChangeVariantAuto={handleChangeVariantAuto}
                      onChangeVariantNamed={handleChangeVariantNamed}
                      onChangeVariantManual={handleChangeVariantManual}
                    />
                  </InputGroup>
                </NavTabContent>
              </NavTab>
            </li>
            <li>
              <NavTab id="dark-theme">
                <NavTabLabel>Dark Theme</NavTabLabel>
                <NavTabContent>
                  <div>dark stuff</div>
                </NavTabContent>
              </NavTab>
            </li>
          </ul>
        </ColorSwatchTabs> */}
      </div>
    </ColorSwatch>
  );
}
