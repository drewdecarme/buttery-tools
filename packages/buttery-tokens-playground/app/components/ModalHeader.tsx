import { classes, useModalContext } from "@buttery/components";
import {
  makeColor,
  makeCustom,
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
  dxSubtitle?: string;
  children: string;
};
export type ModalHeaderProps = ModalHeaderPropsNative & ModalHeaderPropsCustom;

const styles = css`
  padding: ${makeCustom("modal-gutters")};
  display: flex;
  gap: ${makeRem(24)};
  width: 100%;

  & > div {
    flex: 1;
  }

  .title {
    flex: 1;
    font-size: ${makeRem(20)};
    font-family: ${makeFontFamily("body")};
    font-weight: ${makeFontWeight("bold")};
    line-height: 1;
  }

  .subtitle {
    font-size: ${makeRem(16)};
    margin-top: ${makeRem(12)};
    color: ${makeColor("neutral-light", { opacity: 0.8 })};
    font-family: ${makeFontFamily("body")};
    font-weight: ${makeFontWeight("regular")};
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
    { children, className, dxHideClose = false, dxSubtitle, ...restProps },
    ref
  ) {
    const { closeModal } = useModalContext();
    return (
      <header {...restProps} className={classes(styles, className)} ref={ref}>
        <div>
          <div className="title">{children}</div>
          {dxSubtitle && <div className="subtitle">{dxSubtitle}</div>}
        </div>
        {!dxHideClose && (
          <button onClick={closeModal} autoFocus>
            <IconCancel dxSize={24} />
          </button>
        )}
      </header>
    );
  }
);
