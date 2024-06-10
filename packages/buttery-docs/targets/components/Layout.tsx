import { makeRem } from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import { LayoutProvider, type LayoutProviderProps } from "./Layout.context";
import { LayoutFooter } from "./LayoutFooter";
import { LayoutHeader } from "./LayoutHeader";
import { LayoutMain } from "./LayoutMain";
import { LayoutSidebar } from "./LayoutSidebar";

const SContainer = styled("div")`
  display: grid;
  min-height: 100vh;
  // desktop
  grid-template-rows: ${makeRem(64)} auto auto;
  grid-template-columns: ${makeRem(300)} 1fr;
  grid-template-areas:
    "layout-header layout-header"
    "layout-sidebar layout-main"
    "layout-footer layout-footer";
`;

export type LayoutProps = LayoutProviderProps;
export function Layout({ children, ...restProps }: LayoutProps) {
  return (
    <LayoutProvider {...restProps}>
      <SContainer>
        <LayoutHeader />
        <LayoutSidebar />
        <LayoutMain>{children}</LayoutMain>
        <LayoutFooter />
      </SContainer>
    </LayoutProvider>
  );
}
