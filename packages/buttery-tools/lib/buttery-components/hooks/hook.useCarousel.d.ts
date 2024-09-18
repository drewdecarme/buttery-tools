/**
 * To use this hook, you can pass an array of items and then utilize
 * the returned currentItem, next, and prev
 * functions to navigate through the array in a carousel-like manner
 */
export declare const useCarousel: <T extends Record<string, unknown>>(items: T[]) => {
    currentItem: T;
    next: () => void;
    prev: () => void;
};
//# sourceMappingURL=hook.useCarousel.d.ts.map