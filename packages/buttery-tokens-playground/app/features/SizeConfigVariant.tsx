import { classes, useToggle } from "@buttery/components";
import { makeColor, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

import { Button } from "~/components/Button";
import { InputGroup } from "~/components/InputGroup";
import { InputLabel } from "~/components/InputLabel";
import { InputNumber } from "~/components/InputNumber";
import { InputText } from "~/components/InputText";
import { IconDelete } from "~/icons/IconDelete";
import { IconPencilEdit01 } from "~/icons/IconPencilEdit01";

export type SizeConfigVariantPropsNative = JSX.IntrinsicElements["div"];
export type SizeConfigVariantPropsCustom = {
  dxVariantId: string;
  dxName: string;
  dxValue: number;
  dxBaselineGrid: number;
  dxOnChangeVariantProperties: (
    id: string,
    args:
      | { property: "name"; name: string }
      | { property: "value"; value: number }
  ) => void;
};
export type SizeConfigVariantProps = SizeConfigVariantPropsNative &
  SizeConfigVariantPropsCustom;

const styles = css`
  background: white;
  padding: ${makeRem(16)};
  width: 100%;
  border: 1px solid ${makeColor("neutral-light", { opacity: 0.2 })};
  border-radius: ${makeRem(4)};

  h5 {
    margin: 0;
  }

  .bar {
    display: grid;
    grid-template-columns: ${makeRem(50)} auto 1fr;
    gap: ${makeRem(16)};
    align-items: center;
  }

  .value {
    padding-left: ${makeRem(8)};
    position: relative;
    font-size: ${makeRem(12)};
    color: ${makeColor("neutral-light", { opacity: 0.8 })};

    &::before {
      content: "";
      position: absolute;
      left: -${makeRem(8)};
      top: 0;
      bottom: 0;
      height: 100%;
      background: ${makeColor("neutral-light", { opacity: 0.4 })};
      width: 1px;
    }
  }
  .actions {
    display: flex;
    gap: ${makeRem(4)};
    justify-content: flex-end;
    align-items: center;
  }

  .bottom {
    margin-top: ${makeRem(16)};
    padding-top: ${makeRem(16)};
    border-top: ${makeRem(1)} solid
      ${makeColor("neutral-light", { opacity: 0.2 })};
  }
`;

export const SizeConfigVariant = forwardRef<
  HTMLDivElement,
  SizeConfigVariantProps
>(function SizeConfigVariant(
  {
    children,
    className,
    dxVariantId,
    dxName,
    dxValue,
    dxBaselineGrid,
    dxOnChangeVariantProperties,
    ...restProps
  },
  ref
) {
  const [isOpen, toggle] = useToggle();

  return (
    <div {...restProps} className={classes(styles, className)} ref={ref}>
      <div className="bar">
        <h5>{dxName}</h5>
        <div className="value">{dxValue}px</div>
        <div className="actions">
          <Button
            dxVariant="icon"
            DXIcon={IconPencilEdit01}
            onClick={toggle}
            dxSize="dense"
            dxHelp="Toggle Edit"
          />
          <Button
            dxVariant="icon"
            DXIcon={IconDelete}
            dxSize="dense"
            dxHelp="Delete Variant"
          />
        </div>
      </div>
      {isOpen && (
        <div className="bottom">
          <InputGroup>
            <InputLabel dxLabel="Token name" dxSize="dense">
              <InputText
                dxSize="dense"
                value={dxName}
                onChange={({ currentTarget: { value } }) =>
                  dxOnChangeVariantProperties(dxVariantId, {
                    property: "name",
                    name: value,
                  })
                }
              />
            </InputLabel>
            <InputLabel
              dxLabel="Value in pixels"
              dxSize="dense"
              dxHelp="In increments of the baseline grid"
            >
              <InputNumber
                dxSize="dense"
                defaultValue={dxValue}
                step={dxBaselineGrid}
                onChange={({ currentTarget: { value } }) =>
                  dxOnChangeVariantProperties(dxVariantId, {
                    property: "value",
                    value: Number(value),
                  })
                }
              />
            </InputLabel>
          </InputGroup>
        </div>
      )}
    </div>
  );
});
