import { css } from "@linaria/core";
import { match } from "ts-pattern";
import {
  makeColor,
  makeFontFamily,
  makePx,
  makeRem,
} from "@buttery/tokens/playground";
import type { JSX } from "react";
import { classes } from "@buttery/components";

import { StyleGuidePage } from "./StyleGuidePage";
import { StyleGuidePageLeft } from "./StyleGuidePageLeft";
import { StyleGuidePageRight } from "./StyleGuidePageRight";
import type { StyleGuideSharedProps } from "./style-guide.utils";
import { styleGuideTableStyles } from "./style-guide.utils";

import { useConfigurationContext } from "../Config.context";

const styles = css`
  th {
    text-align: left;
    &:first-child {
      width: ${makeRem(52)};
    }
  }
  tbody {
    tr {
      td {
        font-family: ${makeFontFamily("Consolas")};
        padding-top: ${makeRem(8)};
        padding-bottom: ${makeRem(8)};
      }
    }
  }

  .variant {
    height: ${makeRem(32)};
    padding: 0 ${makeRem(8)};
    border-radius: ${makeRem(2)};
    position: relative;
    gap: ${makeRem(16)};
    display: flex;
    align-items: center;

    span {
      display: block;
      font-family: ${makeFontFamily("Consolas")};

      &.bg {
        width: var(--value);
        height: 100%;
        background: ${makeColor("primary", { opacity: 0.5 })};
      }
    }
  }
`;

function variantProps(value: number): JSX.IntrinsicElements["div"] {
  return {
    className: "variant",
    // @ts-expect-error CSS Custom properties are valid style keys
    style: { ["--value"]: makePx(value) },
  };
}

export function StyleGuideBasicSpacing(props: StyleGuideSharedProps) {
  const {
    sizing: { space },
  } = useConfigurationContext();
  return (
    <StyleGuidePage>
      <StyleGuidePageLeft dxMarker={props.dxMarker} dxTitle={props.dxTitle}>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam,
          sapiente eaque? Odio dolore rem id soluta quas quos blanditiis hic,
          ea, nam earum cum nulla laboriosam porro quo pariatur. Sapiente?
        </p>
      </StyleGuidePageLeft>
      <StyleGuidePageRight>
        <table className={classes(styleGuideTableStyles, styles)}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {match(space)
              .with({ mode: "auto" }, (state) => {
                return Object.entries(state.auto.variants).map(
                  ([spaceId, spaceDef]) => (
                    <tr key={spaceId}>
                      <td>{spaceDef.name}</td>
                      <td>
                        <div {...variantProps(spaceDef.value)}>
                          <span className="bg" />
                          <span>{makePx(spaceDef.value)}</span>
                        </div>
                      </td>
                    </tr>
                  )
                );
              })
              .with({ mode: "manual" }, (state) => {
                return Object.entries(state.manual.variants).map(
                  ([spaceId, spaceDef]) => (
                    <tr key={spaceId}>
                      <td>{spaceDef.name}</td>
                      <td>
                        <div {...variantProps(spaceDef.value)}>
                          <span className="bg" />
                          <span>{makePx(spaceDef.value)}</span>
                        </div>
                      </td>
                    </tr>
                  )
                );
              })
              .exhaustive()}
          </tbody>
        </table>
      </StyleGuidePageRight>
    </StyleGuidePage>
  );
}
