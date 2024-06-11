import { makeColor, makeRem } from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import type { FC } from "react";
import { useLayoutContext } from "./Layout.context";

const SLayoutTOC = styled("article")`
  grid-area: layout-toc;
  padding: ${makeRem(32)};
  border-left: ${makeRem(1)} solid
    ${makeColor("neutral", { variant: "50", opacity: 0.5 })};
  position: sticky;
  top: var(--buttery-docs-header);
`;

export const LayoutTOC: FC = () => {
  const { tableOfContents } = useLayoutContext();

  return (
    <SLayoutTOC>
      on this page
      <pre>{JSON.stringify(tableOfContents, null, 2)}</pre>
    </SLayoutTOC>
  );
};
