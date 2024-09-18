import { type ToastComponent } from "./toast.utils";
export declare function Toaster<ToastComponentProps extends {
    [key: string]: unknown;
}>({ ToastComponent, id, }: {
    ToastComponent: ToastComponent<ToastComponentProps>;
    /**
     * The ID of the toaster where the toasts will be added. A mutation observer
     */
    id?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Toaster.d.ts.map