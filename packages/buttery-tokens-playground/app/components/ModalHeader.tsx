import { classes, useModalContext } from "@buttery/components";
import {
  makeFontFamily,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { forwardRef } from "react";

import { IconCancel } from "~/icons/IconCancel";

export type ModalHeaderPropsNative = Omit<
  JSX.IntrinsicElements["header"],
  "children"
>;
export type ModalHeaderPropsCustom = {
  dxHideClose?: boolean;
  children: string;
};
export type ModalHeaderProps = ModalHeaderPropsNative & ModalHeaderPropsCustom;

const styles = css`
  padding: ${makeRem(24)};
  display: flex;
  gap: ${makeRem(24)};
  align-items: center;

  .title {
    flex: 1;
    font-size: ${makeRem(20)};
    font-family: ${makeFontFamily("body")};
    font-weight: ${makeFontWeight("bold")};
    line-height: 1;
  }

  button {
    ${makeReset("button")};
    height: ${makeRem(24)};
    aspect-ratio: 1 / 1;
    display: grid;
    place-content: center;
    border-radius: ${makeRem(4)};
  }
`;
export const ModalHeader = forwardRef<HTMLElement, ModalHeaderProps>(
  function ModalHeader(
    { children, className, dxHideClose = false, ...restProps },
    ref
  ) {
    const { closeModal } = useModalContext();
    return (
      <header {...restProps} className={classes(styles, className)} ref={ref}>
        <div className="title">{children}</div>
        {!dxHideClose && (
          <button onClick={closeModal} autoFocus>
            <IconCancel dxSize={16} />
          </button>
        )}
      </header>
    );
  }
);
