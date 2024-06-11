import {
  makeColor,
  makeColorStatic,
  makeCustom,
  makeRem,
} from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import type { FC } from "react";
import type { ButteryDocsGraphTOC } from "../../commands/_utils/types";
import { useLayoutContext } from "./Layout.context";

const SLayoutBodyTOC = styled("article")`
  grid-area: layout-toc;
  border-left: ${makeRem(1)} solid
    ${makeColor("neutral", { variant: "50", opacity: 0.5 })};
  background: ${makeColorStatic("background")};

  & > div {
    padding: ${makeRem(32)};
    position: sticky;
    top: ${makeCustom("layout-header-height")};
  }
`;

export function ContentsNode({
  tableOfContents,
  NavLinkComponent,
}: {
  tableOfContents: ButteryDocsGraphTOC[];
  NavLinkComponent: JSX.ElementType;
}) {
  return tableOfContents.map((toc, i) => {
    return (
      <ul key={`${toc.level}-${i}`}>
        <li>
          <NavLinkComponent href={toc.link}>{toc.title}</NavLinkComponent>
          {toc.children.length > 0 && (
            <ContentsNode
              tableOfContents={toc.children}
              NavLinkComponent={NavLinkComponent}
            />
          )}
        </li>
      </ul>
    );
  });
}

export const LayoutBodyTOC: FC = () => {
  const { tableOfContents, NavLinkComponent } = useLayoutContext();

  console.log(tableOfContents);

  return (
    <SLayoutBodyTOC>
      <div>
        on this page
        <ContentsNode
          tableOfContents={tableOfContents}
          NavLinkComponent={NavLinkComponent}
        />
      </div>
    </SLayoutBodyTOC>
  );
};
