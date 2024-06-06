import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { localTokens } from "playground/src/tokens/tokens-local";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useTabsContext } from "./Tab.context";

export type TabLabelIndicatorPropsNative = JSX.IntrinsicElements["div"];
export type TabLabelIndicatorProps = TabLabelIndicatorPropsNative;

const SDiv = styled("div")`
  position: absolute;
  border-radius: ${localTokens.makeRem(4)};
  background: ${localTokens.makeColor("primary", { variant: "200" })};
  transition: left 0.25s;
`;

export const TabLabelIndicator = forwardRef<
  { focus: HTMLDivElement["focus"] },
  TabLabelIndicatorProps
>(function TabLabelIndicator({ children, className, ...restProps }, ref) {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabPanelsRef = useRef<HTMLCollectionOf<HTMLDivElement> | null>(null);
  const { activeTab } = useTabsContext();

  const getTabsRef = useCallback(() => {
    if (!tabPanelsRef.current) {
      tabPanelsRef.current = document.getElementsByClassName(
        "tab-panel"
      ) as HTMLCollectionOf<HTMLDivElement>;
    }
    return tabPanelsRef.current;
  }, []);

  useImperativeHandle(ref, () => ({
    focus: () => {
      indicatorRef.current?.focus();
    },
  }));

  useEffect(() => {
    const tabPanels = getTabsRef();
    const activeTabPanel = tabPanels.namedItem(activeTab.concat("-tab"));
    console.log({ activeTabPanel });
    if (!indicatorRef.current || !activeTabPanel) return;

    const left = localTokens.makeRem(activeTabPanel.offsetLeft);
    const top = localTokens.makeRem(activeTabPanel.offsetTop);
    const width = localTokens.makeRem(activeTabPanel.offsetWidth);
    const height = localTokens.makeRem(activeTabPanel.offsetHeight);

    indicatorRef.current.style.left = left;
    indicatorRef.current.style.top = top;
    indicatorRef.current.style.width = width;
    indicatorRef.current.style.height = height;
  }, [activeTab, getTabsRef]);

  return (
    <SDiv {...restProps} className={clsx(className)} ref={indicatorRef}>
      {children}
    </SDiv>
  );
});
