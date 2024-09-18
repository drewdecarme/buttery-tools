export declare function useIntervalState<T>(data: Array<T>, options?: {
    endless?: boolean;
    interval?: number;
    initialIndex?: number;
    /**
     * The amount that the CSS transition should take in seconds
     * @default .25 // 1 second
     */
    transitionDuration?: number;
}): {
    currentData: T;
    animationClassName: "exiting" | "entering" | undefined;
    currentIndex: number;
};
//# sourceMappingURL=hook.useIntervalState.d.ts.map