import type { FC } from "react";
type ComponentsToastProps = {
    variant: "success" | "error";
    message: string;
};
export declare const useComponentsToast: () => {
    create: (options: ComponentsToastProps) => void;
};
export declare const ComponentsToaster: FC;
type FeaturesToastProps = {
    variant: "info" | "warning";
    message: string;
    feature: string;
};
export declare const useFeaturesToast: () => {
    create: (options: FeaturesToastProps) => void;
};
export declare const FeaturesToaster: FC;
declare const _default: () => import("react/jsx-runtime").JSX.Element;
export default _default;
//# sourceMappingURL=ToastMultipleToasters.example.d.ts.map