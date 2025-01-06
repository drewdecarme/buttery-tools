import { css } from "@linaria/core";
import { makeColor, makeRem, makeReset } from "@buttery/tokens/playground";
import { useState } from "react";
import { classes, useToggle } from "@buttery/components";

import { Button } from "~/components/Button";
import { IconPencilEdit01 } from "~/icons/IconPencilEdit01";
import { IconTick01 } from "~/icons/IconTick01";
import { InputText } from "~/components/InputText";

import type { ConfigurationStateSizeSpaceVariants } from "./config.utils";

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(8)};

  li {
    display: grid;
    grid-template-columns: 1fr ${makeRem(54)} ${makeRem(54)} auto;
    gap: ${makeRem(16)};
    height: ${makeRem(44)};
    background: white;
    align-items: center;
    padding: 0 ${makeRem(16)};
    font-size: ${makeRem(14)};
    border-radius: ${makeRem(4)};

    .stat {
      justify-self: start;
      display: flex;
      gap: ${makeRem(8)};
      font-size: ${makeRem(14)};
      color: ${makeColor("neutral-light", { opacity: 0.5 })};

      span.txt {
        min-width: ${makeRem(36)};
      }
    }

    .actions {
      justify-self: end;
      font-size: ${makeRem(14)};
    }

    .save {
      color: ${makeColor("success-500")};
    }
  }
`;
type SpaceConfigVariantItemProps = {
  baseFontSize: number;
  onAddVariant?: () => {};
  onDeleteVariant?: () => {};
  onChangeVariantName?: () => {};
  onChangeVariantValue?: () => {};
};

function SpaceConfigVariantItem({
  name,
  value,
  baseFontSize,
}: SpaceConfigVariantItemProps & { name: string; value: number }) {
  const [isEditing, toggle] = useToggle(false);
  return (
    <>
      <div>
        {isEditing ? (
          <InputText defaultValue={name} dxSize="dense" dxType="text" />
        ) : (
          name
        )}
      </div>
      <div className="stat">{`${value}px`}</div>
      <div className="stat">{`${value / baseFontSize}rem`}</div>
      <div className="actions">
        <Button
          dxVariant="icon"
          dxSize="dense"
          dxStyle="normal"
          DXIcon={isEditing ? IconTick01 : IconPencilEdit01}
          dxHelp={isEditing ? "Save name" : "Edit name"}
          className={classes({ save: isEditing })}
          onClick={toggle}
        />
      </div>
    </>
  );
}

export function SpaceConfigVariants({
  variants,
  ...restProps
}: SpaceConfigVariantItemProps & {
  variants: ConfigurationStateSizeSpaceVariants;
}) {
  return (
    <ul className={styles}>
      {Object.entries(variants).map(([variantId, { name, value }]) => {
        return (
          <li key={variantId}>
            <SpaceConfigVariantItem {...restProps} name={name} value={value} />
          </li>
        );
      })}
    </ul>
  );
}
