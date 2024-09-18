import type { FC } from "react";
export declare const toastContainerId = "toast-container";
export declare function deCapitalizeFirstLetter(string: string): string;
export declare function capitalizeFirstLetter(string: string): string;
export type ToastOptions = {
    closeToast: () => void;
};
export type ToastComponent<T extends Record<string, unknown>> = FC<T & ToastOptions>;
export declare const getToasterOptionsMap: <T extends Record<string, unknown>>() => Map<string, T>;
export declare const getToastOptions: <T extends Record<string, unknown>>(node: Node) => T & {
    id: string;
};
export declare const deleteToastOptions: <T extends Record<string, unknown>>(toastId: string) => void;
export declare const setToastOptions: <T>(options: T & {
    closeToast: () => void;
}) => string;
//# sourceMappingURL=toast.utils.d.ts.map