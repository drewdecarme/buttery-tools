import { type MutableRefObject } from "react";
import type { ModalDefaultState, ModalRef } from "../../hooks";
export declare function useDrawer<T extends ModalDefaultState>(): {
    drawerRef: MutableRefObject<ModalRef>;
    openDrawer: (e: React.MouseEvent<HTMLElement> | undefined, initialData?: T | undefined) => void;
    closeDrawer: () => void;
};
//# sourceMappingURL=drawer.useDrawer.d.ts.map