/**
 * Represents different predefined breakpoints for responsive design.
 */
type Breakpoint = "mobile" | "tablet" | "desktop" | "retina";
/**
 * Represents the map of breakpoints to their corresponding viewport widths.
 */
export declare const breakpointMap: {
    [key in Breakpoint]: number;
};
export type BreakpointFromTo = {
    from?: Breakpoint;
    to?: Breakpoint;
};
type UseBreakpointParams = Breakpoint | BreakpointFromTo;
/**
 * A custom React hook that listens to the size of the viewport and determines whether it passes a certain predefined breakpoint.
 */
export declare function useBreakpoint(params: UseBreakpointParams): boolean;
export {};
//# sourceMappingURL=hook.useBreakpoint.d.ts.map