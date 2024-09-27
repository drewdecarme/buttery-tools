import { useImperativeHandle, useRef } from "react";

/**
 * A custom hook that manages an internal ref and forwards it to a parent component.
 *
 * This hook creates a ref that can be used internally within a component while also allowing
 * a parent component to access the current value of the ref via a forwarded reference.
 *
 * @example
 * const MyComponent = forwardRef((props, ref) => {
 *   const internalRef = useForwardedRef(ref);
 *
 *   return <input ref={internalRef} />;
 * });
 */
export function useForwardedRef<T>(forwardedRef: React.Ref<T>) {
  const internalRef = useRef<T | null>(null);

  // @ts-expect-error
  useImperativeHandle(forwardedRef, () => ({
    get current() {
      return internalRef.current;
    },
    set current(value) {
      internalRef.current = value;
    }
  }));

  return internalRef;
}
