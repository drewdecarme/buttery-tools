import { useCallback, useMemo } from "react";
import { capitalizeFirstLetter, toastContainerId } from "./toast.utils";

export const useToast = <
  ToastOptions extends Record<string, string | number | boolean>,
>() => {
  const create = useCallback<(options: ToastOptions) => void>((options) => {
    if (typeof window === "undefined") return;
    const toastContainer = document.querySelector(`#${toastContainerId}`);
    if (!toastContainer) {
      console.warn(
        "Cannot find the Toaster ID in the DOM. Please ensure that you add the <Toaster /> component anywhere in the React tree."
      );
      return;
    }

    const toast = document.createElement("article");
    for (const optionKey in options) {
      const optionValue = options[optionKey];
      toast.dataset[`option${capitalizeFirstLetter(optionKey)}`] =
        optionValue.toString();
    }
    toast.setAttribute("name", window.crypto.randomUUID());

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  }, []);

  return useMemo(
    () => ({
      create,
    }),
    [create]
  );
};
