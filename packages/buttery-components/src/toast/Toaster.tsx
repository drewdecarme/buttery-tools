import {
  type FC,
  type RefCallback,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Toast } from "./Toast";
import { getToastOptions, toastContainerId } from "./toast.utils";

export function Toaster<
  ToastComponentProps extends Record<string, string | number | boolean>,
>({ ToastComponent }: { ToastComponent: FC<ToastComponentProps> }) {
  const [toasts, setToasts] = useState<{ [key: string]: ToastComponentProps }>(
    {}
  );
  const mutationObserverRef = useRef<MutationObserver | undefined>(undefined);
  const ref = useCallback<RefCallback<HTMLDivElement>>((targetNode) => {
    if (!targetNode) return;

    const callback: MutationCallback = (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          if (mutation.addedNodes.length) {
            for (const addedNode of mutation.addedNodes) {
              const toastProps =
                getToastOptions<ToastComponentProps>(addedNode);
              setToasts((prevState) => ({
                ...prevState,
                [toastProps.id]: toastProps,
              }));
            }
          }
          if (mutation.removedNodes.length) {
            for (const removedNode of mutation.removedNodes) {
              const toastProps = getToastOptions(removedNode);
              setToasts((prevState) => {
                const { [toastProps.id]: deletedToast, ...restState } =
                  prevState;
                return restState;
              });
            }
          }
        } else if (mutation.type === "attributes") {
          console.log(`The ${mutation.attributeName} attribute was modified.`);
        }
      }
    };

    mutationObserverRef.current = new MutationObserver(callback);
    mutationObserverRef.current.observe(targetNode, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }, []);

  useEffect(() => {
    // disconnect when the toaster is removed.
    return () => {
      mutationObserverRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      <div id={toastContainerId} style={{ display: "none" }} ref={ref} />
      {Object.values(toasts).length > 0 &&
        createPortal(
          Object.values(toasts).map((toast) => {
            const id = toast.id.toString();
            return (
              <Toast key={id} id={id}>
                <ToastComponent {...toast} />
              </Toast>
            );
          }),
          document.body
        )}
    </>
  );
}
