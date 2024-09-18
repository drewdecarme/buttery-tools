export declare const useToast: <ToastOptions extends Record<string, unknown>>(params?: {
    /**
     * An optional ID that should be supplied to the toaster and this hook
     * to customize what container the toasts get mounted to. This should be used
     * when you have multiple instances of the <Toaster /> component in your app.
     */
    id?: string;
    /**
     * The number of `seconds` that the toast will remain open
     * before closing. A value of false will disable the auto
     * close functionality and the toasts will persist until they
     * are manually closed.
     * @default 4
     */
    autoClose?: number | false;
}) => {
    create: (options: ToastOptions) => void;
};
//# sourceMappingURL=toast.useToast.d.ts.map