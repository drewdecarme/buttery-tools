import { useCallback, useState } from "react";
export const useToggle = (initValue) => {
    const [state, setState] = useState(() => initValue ?? false);
    const toggle = useCallback(() => {
        setState((prevState) => !prevState);
    }, []);
    return [state, toggle, { setState }];
};
