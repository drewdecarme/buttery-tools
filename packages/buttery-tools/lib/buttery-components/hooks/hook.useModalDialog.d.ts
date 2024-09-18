import { type MutableRefObject, type Ref, type RefCallback } from "react";
export type ModalDefaultState = Record<string, unknown>;
export type ModalRef<T extends ModalDefaultState = ModalDefaultState> = {
    handleOpen: (e: React.MouseEvent<HTMLElement> | undefined, initialData?: T) => void;
    handleClose: () => void;
    nodeRef: MutableRefObject<HTMLDialogElement | null>;
};
export type ModalState<T extends ModalDefaultState = ModalDefaultState> = T;
export type UseModalOptions = {
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
/**
 * A custom hook that can turn any dialog element into a modal dialog.
 *
 * This hook provides a modal dialog with the ability to open, close, and handle specific events.
 * It integrates with the `usePortal` hook to manage the portal for rendering the modal dialog in the DOM.
 * The hook returns a set of properties and functions to control the modal's behavior.
 *
 * @example
 * // Example usage:
 * const modalRef = useRef(null);
 * const { dialogRef, Portal } = useModalDialog({
 *   ref: modalRef,
 *   closeOnBackdropClick: true,
 *   onClose: () => console.log('Modal closed'),
 * });
 *
 * return (
 *   <Portal>
 *     <dialog ref={dialogRef}>
 *       <p>Modal Content</p>
 *       <button onClick={() => modalRef.current.handleClose()}>Close</button>
 *     </dialog>
 *   </Portal>
 * );
 */
export declare const useModalDialog: <T extends ModalDefaultState = ModalDefaultState>(params: UseModalOptions & {
    ref: MutableRefObject<ModalRef<T>> | Ref<ModalRef<T>>;
}) => {
    dialogRef: RefCallback<HTMLDialogElement>;
    dialogState: T | undefined;
    Portal: import("react").NamedExoticComponent<{
        children: import("react").ReactNode;
        disabled?: boolean;
    }>;
    closeModal: () => Promise<void>;
};
//# sourceMappingURL=hook.useModalDialog.d.ts.map