import { css } from "@linaria/core";
import { makeRem } from "@buttery/tokens/playground";
import { Fragment } from "react/jsx-runtime";

import { StyleGuidePage } from "./StyleGuidePage";
import { styleGuideSections } from "./style-guide.utils";

const styles = css`
  display: block;
  padding: ${makeRem(32)};

  h1 {
    font-family: "Playfair Display";
    font-size: ${makeRem(64)};
  }

  .toc {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto;
    row-gap: ${makeRem(16)};
    column-gap: ${makeRem(16)};

    div {
      font-family: "Playfair Display";
      font-size: ${makeRem(32)};
      font-weight: 500;

      &.title {
        font-weight: 700;
      }

      &.marker {
        text-align: right;
      }
    }
  }
`;

export function StyleGuideBasicHome() {
  return (
    <StyleGuidePage className={styles}>
      <h1>Style Guide</h1>
      <div className="toc">
        {styleGuideSections.map((section) => (
          <Fragment key={section.dxTitle}>
            <div className="marker">{section.dxMarker}</div>
            <div className="title">{section.dxTitle}</div>
          </Fragment>
        ))}
      </div>
    </StyleGuidePage>
  );
}
