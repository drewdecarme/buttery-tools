import { css } from "@linaria/core";
import {
  makeColor,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";

import { useConfigurationContext } from "./Config.context";

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(16)};

  li {
    display: grid;
    grid-template-columns: minmax(min-content, max-content) 1fr;
    gap: ${makeRem(32)};

    padding: ${makeRem(32)} 0;

    &:first-of-type {
      padding-top: 0;
    }

    &:not(:first-of-type) {
      border-top: 1px solid ${makeColor("neutral-light", { opacity: 0.1 })};
    }

    .heading {
      h4 {
        margin: 0;
      }

      .sub {
        font-size: ${makeRem(14)};
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: ${makeRem(16)};
        font-weight: ${makeFontWeight("light")};

        dd {
          margin: 0;
        }
      }
    }
  }
`;

export function FontVariantPreviewContent() {
  const {
    font: { variants },
  } = useConfigurationContext();
  return (
    <ul className={styles}>
      {Object.entries(variants).map(([variantId, variant]) => (
        <li key={variantId}>
          <div className="heading">
            <h4>{variant.variantName}</h4>
            <dl className="sub">
              <dt>Family</dt>
              <dd>{variant.family}</dd>
              <dt>Size</dt>
              <dd>
                {variant.size}px / {variant.lineHeight}
              </dd>
              <dt>Weight</dt>
              <dd>{variant.weight}</dd>
            </dl>
          </div>
          <div
            style={{
              fontFamily: `"${variant.family}"`,
              fontSize: variant.size,
              fontWeight: variant.weight.split("-")[1],
              lineHeight: variant.lineHeight,
            }}
          >
            Curious minds discover joy in the beauty of everyday moments
          </div>
        </li>
      ))}
    </ul>
  );
}
