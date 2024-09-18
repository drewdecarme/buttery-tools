import type { DropdownOptions, DropdownRef } from "../../hooks";
export type UseDropdownOptions = Partial<DropdownOptions>;
export declare const useDropdownNav: (options: UseDropdownOptions) => {
    targetProps: import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    dropdownProps: Pick<Required<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLElement>, HTMLElement>>, "id"> & {
        ref: import("react").MutableRefObject<DropdownRef | null>;
    };
    openNav: () => void;
    closeNav: () => void;
    toggleNav: () => void;
};
//# sourceMappingURL=dropdown-nav.useDropdownNav.d.ts.map