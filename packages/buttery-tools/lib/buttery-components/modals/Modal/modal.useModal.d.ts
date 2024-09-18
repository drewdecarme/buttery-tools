import { type MutableRefObject } from "react";
import type { ModalDefaultState, ModalRef } from "../../hooks";
export declare function useModal<T extends ModalDefaultState>(): {
    modalRef: MutableRefObject<ModalRef>;
    openModal: (e: React.MouseEvent<HTMLElement> | undefined, initialData?: T | undefined) => void;
    closeModal: () => void;
};
//# sourceMappingURL=modal.useModal.d.ts.map