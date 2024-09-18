import { useBreakpoint } from "../hooks";
export const Responsive = ({ children, from, to, }) => {
    const shouldRender = useBreakpoint({ from, to });
    if (!shouldRender)
        return null;
    return children;
};
