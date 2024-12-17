import type { ReactNode } from "react";
import { forwardRef } from "react";
import type { ModalRef, UseModalOptions } from "@buttery/components";
import { classes, ModalProvider, useModalDialog } from "@buttery/components";
import { css } from "@linaria/core";
import { makeRem } from "@buttery/tokens/playground";

export type ModalDrawerPropsNative = Omit<
  JSX.IntrinsicElements["dialog"],
  "ref" | "children"
>;
export type ModalDrawerPropsCustom = UseModalOptions & {
  dxVariant: "right-to-left";
  dxSize?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
};
export type ModalDrawerProps = ModalDrawerPropsNative & ModalDrawerPropsCustom;

const styles = css`
  --drawer-width: 0;

  &.s {
    &-sm {
      --drawer-width: 20%;
      width: var(--drawer-width);
    }
    &-md {
      --drawer-width: 40%;
      width: var(--drawer-width);
    }
    &-lg {
      --drawer-width: 60%;
      width: var(--drawer-width);
    }
    &-xl {
      --drawer-width: 80%;
      width: var(--drawer-width);
    }
  }

  display: block;
  padding: 0;
  border: 0;
  transition: backdrop-filter 1s ease;
  margin: 0;
  border: 0;

  &::backdrop {
    transition: backdrop-filter 1s ease;
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.4);
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
      visibility: hidden;
    }
    100% {
      opacity: 1;
      visibility: visible;
    }
  }

  @keyframes fade-out {
    0% {
      opacity: 1;
      visibility: visible;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  &.right-to-left {
    @keyframes rtl-open {
      0% {
        opacity: 0;
        transform: translateX(100%);
      }
      100% {
        opacity: 1;
        transform: translateX(--drawer-width);
      }
    }

    @keyframes rtl-close {
      0% {
        opacity: 1;
        transform: translateX(--drawer-width);
      }
      100% {
        opacity: 0;
        transform: translateX(100%);
      }
    }

    left: calc(100% - var(--drawer-width));
    right: 0;
    height: 100%;
    max-height: 100%;
    position: fixed;
    border-top-left-radius: ${makeRem(4)};
    border-bottom-left-radius: ${makeRem(4)};

    @media (prefers-reduced-motion: no-preference) {
      &[open] {
        animation: rtl-open 0.2s ease-in-out forwards;
        &::backdrop {
          animation: fade-in 0.2s ease-in-out forwards;
        }
      }
      &[data-close="true"] {
        animation: rtl-close 0.2s ease-in-out forwards;
        &::backdrop {
          animation: fade-out 0.2s ease-in-out forwards;
        }
      }
    }
  }
`;

export const ModalDrawer = forwardRef<ModalRef, ModalDrawerProps>(
  function ModalDrawer(
    { children, className, dxVariant, dxSize, ...restProps }: ModalDrawerProps,
    ref
  ) {
    const { isOpen, dialogRef, dialogState, closeModal } = useModalDialog({
      ref,
      ...restProps,
    });

    if (!isOpen) return;

    return (
      <dialog
        id={restProps.id}
        ref={dialogRef}
        className={classes(
          styles,
          dxVariant,
          dxSize && {
            [`s-${dxSize}`]: dxSize,
          },
          className
        )}
      >
        <ModalProvider initialState={dialogState} closeModal={closeModal}>
          {children}
        </ModalProvider>
      </dialog>
    );
  }
);
