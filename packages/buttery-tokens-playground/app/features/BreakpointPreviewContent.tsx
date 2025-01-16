import { css } from "@linaria/core";
import {
  makeColor,
  makeFontWeight,
  makePx,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";
import type { RefCallback } from "react";
import { useCallback, useRef } from "react";

import { useConfigurationContext } from "./Config.context";

const styles = css`
  /* background: #272727; */
  padding: 1rem;

  .points {
    ${makeReset("ul")};
    display: flex;
    justify-content: center;
    gap: ${makeRem(16)};
    padding: ${makeRem(16)};
    margin-bottom: ${makeRem(16)};

    li {
      & + li {
        & > div {
          border-left: 1px solid
            ${makeColor("neutral-light", {
              opacity: 0.4,
            })};
        }
      }
    }

    button {
      ${makeReset("button")};
      width: min-content;
      height: ${makeRem(44)};
      display: grid;
      place-content: center;
      padding: ${makeRem(16)};
      /* color: White; */

      .title {
        font-size: ${makeRem(18)};
      }
      .name {
        font-size: ${makeRem(14)};
        font-weight: ${makeFontWeight("light")};
      }
    }
  }

  .grid {
    ${makeReset("ul")};
    position: relative;
    width: 100%;
    height: 200px;
    padding-top: ${makeRem(40)};

    button {
      ${makeReset("button")};

      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      margin: 0 auto;
      border-left: 1px solid rgb(var(--color));
      border-right: 1px solid rgb(var(--color));

      &:hover {
        background: rgba(var(--color), 0.2);
      }
    }

    .page {
      background: white;
      position: relative;
      z-index: 20;
      padding: 1rem;
      height: 100%;
      border-radius: ${makeRem(4)};
      margin: 1px;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
      margin: 0 auto;
      border: 2px solid transparent;
      transition: width 0.2s ease-in-out;
    }
  }
`;

const colors = [
  "255, 191, 0", // Amber
  "176, 30, 86", // Raspberry
  "15, 82, 186", // Sapphire
  "0, 168, 107", // Jade
  "103, 58, 183", // Deep Purple
  "11, 218, 81", // Malachite
  "218, 165, 32", // Goldenrod
  "155, 17, 30", // Ruby Red
  "64, 224, 208", // Turquoise
  "138, 43, 226", // Violet
  "193, 84, 193", // Fuchsia
  "228, 208, 10", // Citrine
  "0, 128, 128", // Teal
  "223, 124, 223", // Plum
];

export function BreakpointPreviewContent() {
  const { response } = useConfigurationContext();
  const pageRef = useRef<HTMLDivElement | null>(null);
  const maxBreakpoint = Object.values(response.breakpoints).reduce(
    (accum, { value }) => {
      if (value > accum) return value;
      return accum;
    },
    0
  );

  const calculateWidth = useCallback<
    (maxSize: number, containerWidth: number, width: number) => string
  >((maxSize, containerWidth, width) => {
    const scalingFactor = containerWidth / maxSize;

    const scaledValue = width * scalingFactor;
    return makePx(scaledValue);
  }, []);

  const createSetButtonRef = useCallback<
    (colWidth: number, maxBreakpoint: number) => RefCallback<HTMLButtonElement>
  >(
    (colWidth, maxBreakpoint) => (node) => {
      if (!node) return;
      const parent = node.parentElement;
      if (!parent) return;
      const width = calculateWidth(maxBreakpoint, parent.offsetWidth, colWidth);
      node.style.setProperty("width", width);

      node.addEventListener("click", () => {
        if (!pageRef.current) return;
        pageRef.current.style.setProperty("width", `calc(${width} - 2px)`);
      });
    },
    [calculateWidth]
  );

  return (
    <div className={styles}>
      <ul className="points">
        {Object.entries(response.breakpoints)
          .reverse()
          .map(([breakpointId, breakpoint]) => (
            <li key={breakpointId}>
              <button>
                <div className="title">{makePx(breakpoint.value)}</div>
                <div className="name">{breakpoint.name}</div>
              </button>
            </li>
          ))}
      </ul>
      <div className="grid">
        <div>
          {Object.entries(response.breakpoints)
            .sort((a, b) => b[1].value - a[1].value)
            .map(([breakpointId, { value }], i) => (
              <button
                key={breakpointId}
                ref={createSetButtonRef(value, maxBreakpoint)}
                // @ts-expect-error custom properties are valid
                style={{ "--color": colors[i] }}
              />
            ))}
        </div>
        <div className="page" ref={pageRef} />
      </div>
    </div>
  );
}
