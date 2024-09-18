import { type DropdownOptions, type DropdownRef } from "../../hooks";
export type DropdownMenuPropsNative = JSX.IntrinsicElements["div"] & {
    options: DropdownOptions;
};
export type DropdownMenuProps = DropdownMenuPropsNative;
export declare const DropdownMenu: import("react").ForwardRefExoticComponent<Omit<DropdownMenuPropsNative, "ref"> & import("react").RefAttributes<DropdownRef>>;
//# sourceMappingURL=DropdownMenu.d.ts.map