import { css } from "@linaria/core";
import { classes } from "@buttery/components";
import {
  makeColor,
  makeFontFamily,
  makePx,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";

import { StyleGuidePage } from "./StyleGuidePage";
import { StyleGuidePageLeft } from "./StyleGuidePageLeft";
import { StyleGuidePageRight } from "./StyleGuidePageRight";
import type { StyleGuideSharedProps } from "./style-guide.utils";
import { styleGuideTableStyles } from "./style-guide.utils";

import { useConfigurationContext } from "../Config.context";

const styles = css`
  table-layout: auto;

  td {
    text-align: left;
    font-family: ${makeFontFamily("Consolas")};
    padding-top: ${makeRem(16)} !important;
    padding-bottom: ${makeRem(16)} !important;

    .height {
      display: grid;
      place-content: center;
      position: relative;
      padding-right: ${makeRem(12)};

      &:after {
        content: "";
        display: block;
        width: 5px;
        right: 0;
        background: ${makeColor("primary", { opacity: 0.5 })};
        height: 100%;
        position: absolute;
      }
    }

    .ex {
      display: flex;
      gap: ${makeRem(8)};
      font-size: ${makeRem(12)};

      button {
        ${makeReset("button")};
        padding: 0 1em;
        background: ${makeColor("primary")};
        border-radius: ${makeRem(4)};
        font-family: ${makeFontFamily("Consolas")};
        display: grid;
        place-content: center;
        width: ${makeRem(120)};
      }

      input {
        ${makeReset("input")};
        padding: 0 1em;
        border: 1px solid ${makeColor("primary")};
        font-family: ${makeFontFamily("Consolas")};
        border-radius: ${makeRem(4)};
      }
    }

    .icon {
      display: grid;
      place-content: center;
      font-size: 0.6em;
    }
  }

  th {
    text-align: left;
    &:not(:last-child) {
      width: auto;
      max-width: min-content;
    }
    &:last-child {
      width: 100%;
    }
  }
`;

export function StyleGuideBasicSize(props: StyleGuideSharedProps) {
  const {
    sizing: { size },
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
              <th>token name</th>
              <th>height</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(size.variants).map(([sizeId, { name, value }]) => {
              const height = makePx(value);

              return (
                <tr key={sizeId}>
                  <td>{name}</td>
                  <td>
                    <div style={{ height }} className="height">
                      {height}
                    </div>
                  </td>
                  <td>
                    <div className="ex">
                      <button type="button" style={{ height }}>
                        {name}
                      </button>
                      <input
                        type="text"
                        style={{ height }}
                        defaultValue={`Input - ${name}`}
                      />
                      <div
                        className="icon"
                        style={{
                          height,
                          aspectRatio: "1 / 1",
                          border: `1px solid ${makeColor("primary")}`,
                        }}
                      >
                        i
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </StyleGuidePageRight>
    </StyleGuidePage>
  );
}
