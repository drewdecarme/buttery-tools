import {
  type MutableRefObject,
  type Ref,
  type RefCallback,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePortal } from "../hooks";
import { exhaustiveMatchGuard } from "../utils";

export type DialogDefaultState = Record<string, unknown>;

export type DialogRef<T extends DialogDefaultState = DialogDefaultState> = {
  handleOpen: (
    e:
      | React.MouseEvent<HTMLElement>
      | React.FocusEvent<HTMLElement>
      | undefined,
    initialData?: T
  ) => void;
  handleClose: () => void;
  nodeRef: MutableRefObject<HTMLDialogElement | null>;
};

export type DialogState<T extends DialogDefaultState = DialogDefaultState> = T;

export type UseDialogOptions = {
  /**
   * The type of dialog that should be rendered
   */
  type: "modal" | "default";
  /**
   * Option to determine if the dialog should be closed
   * by clicking on the ::backdrop element
   * @default true
   */
  closeOnBackdropClick?: boolean;
  /**
   * A general handler to do something after the dialog
   * full closes
   */
  onClose?: () => void;
};

export const useDialog = <T extends DialogDefaultState = DialogDefaultState>(
  params: UseDialogOptions & {
    ref: MutableRefObject<DialogRef<T>> | Ref<DialogRef<T>>;
  }
) => {
  const iDialogRef = useRef<HTMLDialogElement | null>(null);
  const [dialogState, setDialogState] = useState<DialogState<T>>();
  const { Portal, openPortal, closePortal } = usePortal();
  const dialogEventClickRef = useRef<void | null>(null);
  const dialogEventCancelRef = useRef<void | null>(null);

  const closeDialog = useCallback(async () => {
    if (!iDialogRef.current) return;
    const dialogNode = iDialogRef.current;

    const onClose = params?.onClose ?? (() => void 0);
    // add the class close to the dialog to add any closing animations
    dialogNode.dataset["close"] = "true";

    // get the animations on the entire dialog and wait until they complete
    const animations = dialogNode.getAnimations({ subtree: true });
    await Promise.allSettled(animations.map((animation) => animation.finished));

    // close the dialog
    dialogNode.close();

    // Run any custom onClose function
    onClose();

    dialogEventClickRef.current = null;
    dialogEventCancelRef.current = null;

    // Close and destroy the portal
    closePortal();
  }, [closePortal, params?.onClose]);

  /**
   * This callbackRef is supplied to the dialog node in the dom.
   * Once this becomes available that means that the portal has been opened
   * and the dialog has rendered in the DOM. From here we run some stuff
   * that is associated with the dialog opening.
   */
  const dialogRef = useCallback<RefCallback<HTMLDialogElement>>(
    (dialogNode) => {
      if (!dialogNode) return;
      iDialogRef.current = dialogNode;

      // Reconcile some params
      const type = params.type ?? "default";
      const enableBackdropClose = params.closeOnBackdropClick ?? true;

      // Add the type to the dialogs className
      dialogNode.classList.add(type);

      // Open the dialog
      switch (type) {
        case "default":
          dialogNode.show();
          break;

        case "modal":
          dialogNode.showModal();
          break;

        default:
          exhaustiveMatchGuard(type);
          break;
      }

      // Add some event listeners
      dialogEventCancelRef.current = dialogNode.addEventListener(
        "cancel",
        (e) => {
          // prevent the close event from firing.
          e.preventDefault();
          closeDialog();
        }
      );

      // short circuit
      if (!enableBackdropClose) return;

      // Close the dialog if the dialog::backdrop is clicked
      dialogEventClickRef.current = dialogNode.addEventListener(
        "click",
        ({ target }) => {
          const { nodeName } = target as HTMLDialogElement;
          if (nodeName === "DIALOG") {
            closeDialog();
          }
        }
      );
    },
    [closeDialog, params.closeOnBackdropClick, params.type]
  );

  /**
   * Override the ref and add 2 functions to open and close
   * the dialog
   */
  useImperativeHandle(params.ref, () => {
    return {
      handleOpen(_, initState = {} as T) {
        setDialogState(initState);
        openPortal();
      },
      handleClose: closeDialog,
      nodeRef: iDialogRef,
    };
  });

  return useMemo(
    () => ({
      dialogRef,
      dialogState,
      Portal,
      closeDialog,
    }),
    [Portal, closeDialog, dialogRef, dialogState]
  );
};
