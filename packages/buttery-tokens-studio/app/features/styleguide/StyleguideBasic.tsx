import { css } from "@linaria/core";
import type { ReactNode } from "react";
import { makeColor, makeRem } from "@buttery/tokens/playground";

import { ColorPreviewBrand } from "../color/ColorPreviewBrand";
import { ColorPreviewProvider } from "../color/ColorPreview.context";

const pageStyles = css`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${makeRem(32)};

  .page-num {
    padding: 0 ${makeRem(32)};
    border-right: 1px solid ${makeColor("neutral-light", { opacity: 0.2 })};
    font-size: ${makeRem(84)};
    font-family: "Playfair Display";
  }
`;

function Page(props: { pageNum: string; children: ReactNode }) {
  return (
    <div className={pageStyles}>
      <div className="page-num">{props.pageNum}</div>
      <div>{props.children}</div>
    </div>
  );
}

const titleStyles = css`
  font-size: ${makeRem(32)};
  font-family: "Playfair Display";
`;

function PageTitle(props: { children: string }) {
  return <h2 className={titleStyles}>{props.children}</h2>;
}

const descriptionStyles = css`
  font-size: ${makeRem(18)};
  font-family: "Playfair Display";
`;

function PageDescription(props: { children: string }) {
  return <div className={descriptionStyles}>{props.children}</div>;
}

export function StyleGuideBasic() {
  return (
    <Page pageNum="01">
      <PageTitle>Color</PageTitle>
      <PageDescription>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam,
        sapiente eaque? Odio dolore rem id soluta quas quos blanditiis hic, ea,
        nam earum cum nulla laboriosam porro quo pariatur. Sapiente?
      </PageDescription>
      <ColorPreviewProvider>
        <ColorPreviewBrand />
      </ColorPreviewProvider>
    </Page>
  );
}
