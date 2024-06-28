import { styled } from "@linaria/react";
import { clsx } from "clsx";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { makeColor, makeRem } from "#buttery/tokens/playground";
import { useTabsContext } from "./Tab.context";

export type TabLabelIndicatorPropsNative = JSX.IntrinsicElements["div"];
export type TabLabelIndicatorProps = TabLabelIndicatorPropsNative;

const SDiv = styled("div")`
  position: absolute;
  border-radius: ${makeRem(4)};
  background: ${makeColor("primary", { variant: "200" })};
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

    const left = makeRem(activeTabPanel.offsetLeft);
    const top = makeRem(activeTabPanel.offsetTop);
    const width = makeRem(activeTabPanel.offsetWidth);
    const height = makeRem(activeTabPanel.offsetHeight);

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
