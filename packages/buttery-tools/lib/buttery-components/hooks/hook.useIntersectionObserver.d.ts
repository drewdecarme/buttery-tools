type IntersectionObserverOptions = {
    once?: boolean;
    root?: Element | Document | null;
    rootMargin?: string;
    threshold?: number | number[];
};
/**
 * A custom React hook that uses the Intersection Observer API to detect when a specified
 * ref element becomes visible on the page.
 *
 * @example
 * // Usage example in a React component:
 *
 * import React from 'react';
 * import useIntersectionObserver from './useIntersectionObserver';
 *
 * const MyComponent = () => {
 *   const [ref, isIntersecting] = useIntersectionObserver();
 *
 *   useEffect(() => {
 *     console.log('isIntersecting:', isIntersecting);
 *   }, [isIntersecting]);
 *
 *   return (
 *     <div>
 *       <div style={{ height: '100vh' }}>Scroll down</div>
 *       <div ref={ref} style={{ background: isIntersecting ? 'green' : 'red', height: '200px' }}>
 *         This element becomes green when it is visible on the page.
 *       </div>
 *     </div>
 *   );
 * };
 *
 * export default MyComponent;
 */
export declare const useIntersectionObserver: <T extends HTMLElement>(options?: IntersectionObserverOptions) => [ref: React.MutableRefObject<T | null>, isVisibleOnPage: boolean];
export {};
//# sourceMappingURL=hook.useIntersectionObserver.d.ts.map