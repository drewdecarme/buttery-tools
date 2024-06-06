import { clsx } from "clsx";
import { type ReactNode, forwardRef } from "react";
import { useTabsContext } from "./Tab.context";

export type TabLabelPropsNative = JSX.IntrinsicElements["button"];
export type TabLabelPropsCustom = {
  children: ReactNode;
  btId: string;
};
export type TabLabelProps = TabLabelPropsNative & TabLabelPropsCustom;

export const TabLabel = forwardRef<HTMLButtonElement, TabLabelProps>(
  function TabLabel({ children, className, btId, ...restProps }, ref) {
    const { activeTab, setActiveTab } = useTabsContext();
    return (
      <button
        type="button"
        {...restProps}
        className={clsx(className, {
          active: activeTab === btId,
        })}
        role="tab"
        id={btId.concat("-tab")}
        aria-selected={activeTab === btId}
        aria-controls={btId.concat("-tabpanel")}
        ref={ref}
        onClick={() => setActiveTab(btId)}
      >
        {children}
      </button>
    );
  }
);
