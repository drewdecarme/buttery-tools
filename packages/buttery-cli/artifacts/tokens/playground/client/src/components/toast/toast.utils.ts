export const toastContainerId = "toast-container";

export function deCapitalizeFirstLetter(string: string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getToastOptions = <
  ToastOptions extends Record<string, string | number | boolean>,
>(
  node: Node
): ToastOptions & { id: string } => {
  const toast = node as HTMLElement;

  const options = Object.entries(toast.dataset).reduce<ToastOptions>(
    (accum, [dataKey, dataValue]) => {
      if (!dataKey.startsWith("option")) return accum;
      const plainKey = deCapitalizeFirstLetter(dataKey.replace("option", ""));
      return Object.assign(accum, { [plainKey]: dataValue });
    },
    {} as ToastOptions
  );

  return {
    id: toast.getAttribute("name") as string,
    ...options,
  };
};
