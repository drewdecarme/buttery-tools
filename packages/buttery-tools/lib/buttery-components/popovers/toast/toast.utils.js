export const toastContainerId = "toast-container";
export function deCapitalizeFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export const getToasterOptionsMap = () => {
    if (!window.buttery_toasts) {
        window.buttery_toasts = new Map();
    }
    return window.buttery_toasts;
};
export const getToastOptions = (node) => {
    const toastNode = node;
    const toastId = toastNode.id;
    const optionsMap = getToasterOptionsMap();
    const options = optionsMap.get(toastId);
    if (!options) {
        throw new Error(`Cannot find options for "${toastId}". This should not have happened. Please log an issue.`);
    }
    return {
        id: toastId,
        ...options,
    };
};
export const deleteToastOptions = (toastId) => {
    const optionsMap = getToasterOptionsMap();
    console.log("Deleting toast options", toastId);
    optionsMap.delete(toastId);
};
export const setToastOptions = (options) => {
    const optionsMap = getToasterOptionsMap();
    const toastId = window.crypto.randomUUID();
    optionsMap.set(toastId, options);
    return toastId;
};
