import { type FC } from "react";
type MyToastProps = {
    variant: "success" | "error";
    message: string;
};
export declare const MyToaster: FC;
export declare const useMyToast: () => {
    create: (options: MyToastProps) => void;
};
declare const _default: () => import("react/jsx-runtime").JSX.Element;
export default _default;
//# sourceMappingURL=ToastBestPractice.example.d.ts.map