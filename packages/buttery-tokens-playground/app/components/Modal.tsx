import type { ReactNode } from "react";
import { forwardRef } from "react";
import type { ModalRef, UseModalOptions } from "@buttery/components";
import { classes, ModalProvider, useModalDialog } from "@buttery/components";
import { css } from "@linaria/core";
import { makeColor, makeRem } from "@buttery/tokens/playground";

export type ModalPropsNative = Omit<
  JSX.IntrinsicElements["dialog"],
  "ref" | "children"
>;
export type ModalPropsCustom = UseModalOptions & {
  dxSize?: "sm" | "md" | "lg" | "xl" | "full";
  children: ReactNode;
};
export type ModalProps = ModalPropsNative & ModalPropsCustom;

const styles = css`
  padding: 0;
  border: 0;
  margin: 0;
  margin: auto;
  border-radius: ${makeRem(4)};
  transition: backdrop-filter 1s ease;
  filter: ${` drop-shadow(1px 2px 20px ${makeColor("neutral", {
    opacity: 0.5,
  })})`};

  &.s {
    &-sm {
      width: 20%;
    }
    &-md {
      width: 40%;
    }
    &-lg {
      width: 60%;
    }
    &-xl {
      width: 80%;
    }
    &-full {
      width: 100%;
      height: 100%;
    }
  }

  &::backdrop {
    transition: backdrop-filter 1s ease;
    /* backdrop-filter: blur(10px); */
    background: ${makeColor("neutral-dark", { opacity: 0.5 })};
  }

  /* Animation for appearing */
  @keyframes appear {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Animation for disappearing */
  @keyframes disappear {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.9);
    }
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

  @media (prefers-reduced-motion: no-preference) {
    &[open] {
      animation: appear 0.35s ease-in-out forwards;
      &::backdrop {
        animation: fade-in 0.35s ease-in-out forwards;
      }
    }
    &[data-close="true"] {
      animation: disappear 0.35s ease-in-out forwards;
      &::backdrop {
        animation: fade-out 0.35s ease-in-out forwards;
      }
    }
  }
`;

export const Modal = forwardRef<ModalRef, ModalProps>(function Modal(
  { children, className, dxSize = "md", ...restProps }: ModalProps,
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
});
