import { makeRem } from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import { LayoutProvider, type LayoutProviderProps } from "./Layout.context";
import { LayoutFooter } from "./LayoutFooter";
import { LayoutHeader } from "./LayoutHeader";
import { LayoutMain } from "./LayoutMain";
import { LayoutSidebar } from "./LayoutSidebar";
import { LayoutTOC } from "./LayoutTOC";

const SContainer = styled("div")`
  --buttery-docs-header: ${makeRem(64)};
  display: grid;
  min-height: 100vh;
  // desktop
  grid-template-rows: var(--buttery-docs-header) auto auto;
  grid-template-columns: ${makeRem(300)} 1fr ${makeRem(300)};
  grid-template-areas:
    "layout-header layout-header layout-header"
    "layout-sidebar layout-main layout-toc"
    "layout-footer layout-footer layout-footer";
`;

export type LayoutProps = LayoutProviderProps;
export function Layout({ children, ...restProps }: LayoutProps) {
  return (
    <LayoutProvider {...restProps}>
      <SContainer>
        <LayoutHeader />
        <LayoutSidebar />
        <LayoutMain>{children}</LayoutMain>
        <LayoutTOC />
        <LayoutFooter />
      </SContainer>
    </LayoutProvider>
  );
}
