import type { DropdownOptions, DropdownRef } from "../../hooks";
export declare const useDropdownMenu: (options: DropdownOptions) => {
    targetProps: import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    dropdownProps: {
        options: DropdownOptions;
        ref: import("react").MutableRefObject<DropdownRef | null>;
    };
    openMenu: () => void;
    closeMenu: () => void;
    toggleMenu: () => void;
};
//# sourceMappingURL=dropdown-menu.useDropdownMenu.d.ts.map