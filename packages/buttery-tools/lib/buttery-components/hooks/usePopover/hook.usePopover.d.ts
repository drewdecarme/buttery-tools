import { type RefCallback } from "react";
export declare function ensurePopover<T extends HTMLElement>(node: T | null): node is T;
export declare function ensureTarget<T extends HTMLElement>(node: T | null): node is T;
export type PopoverOptions = {
    /**
     * The ID of the popover. This ID is used for accessibility purposes to ensure
     * that dropdown and the target have the necessary aria-roles.
     */
    id: string;
};
export declare const usePopover: <T extends HTMLElement>({ id }: PopoverOptions) => {
    popoverRef: import("react").MutableRefObject<T | null>;
    targetRef: import("react").MutableRefObject<HTMLButtonElement | null>;
    setPopoverRef: RefCallback<T>;
    setTargetRef: RefCallback<HTMLButtonElement>;
    showPopover: () => void;
    hidePopover: () => Promise<void>;
};
//# sourceMappingURL=hook.usePopover.d.ts.map