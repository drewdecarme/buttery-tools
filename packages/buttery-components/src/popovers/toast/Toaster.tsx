import { type FC, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Toast } from "./Toast";
import { getToastOptions, toastContainerId } from "./toast.utils";

export function Toaster<
  ToastComponentProps extends Record<string, string | number | boolean>,
>({ ToastComponent }: { ToastComponent: FC<ToastComponentProps> }) {
  const [toasts, setToasts] = useState<{ [key: string]: ToastComponentProps }>(
    {}
  );
  const mutationObserverRef = useRef<MutationObserver | undefined>(undefined);
  const toasterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !toasterRef.current) return;

    // disconnect when the toaster mounts.
    const callback: MutationCallback = (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type !== "childList") return;

        if (mutation.addedNodes.length) {
          for (const addedNode of mutation.addedNodes) {
            const toastProps = getToastOptions<ToastComponentProps>(addedNode);
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
              const { [toastProps.id]: deletedToast, ...restState } = prevState;
              return restState;
            });
          }
        }
      }
    };

    mutationObserverRef.current = new MutationObserver(callback);
    console.log("Connecting mutation observer");
    mutationObserverRef.current.observe(toasterRef.current, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    // disconnect when the toaster is removed.
    return () => {
      console.log("Disconnecting mutation observer");
      mutationObserverRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      <div id={toastContainerId} style={{ display: "none" }} ref={toasterRef} />
      {Object.values(toasts).length > 0 &&
        ReactDOM.createPortal(
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
