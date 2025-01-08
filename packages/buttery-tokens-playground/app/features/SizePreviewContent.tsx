import { css } from "@linaria/core";
import { classes } from "@buttery/components";
import { makeRem } from "@buttery/tokens/playground";
import type { ReactNode } from "react";

import { useSizePreviewContext } from "./SizePreview.context";
import { useConfigurationContext } from "./Config.context";

const styles = css`
  position: relative;
  height: ${makeRem(160 * 2 + 1)};
  width: ${makeRem(160 * 4 + 1)};
  margin: 0 auto auto auto;
  background-color: #fff;
  overflow: hidden;
  font-size: var(--base-font-size);

  &.grid {
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(
          to right,
          rgba(0, 0, 0, 0.1) 1px,
          transparent 1px
        ),
        linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
      background-size: var(--baseline-grid) var(--baseline-grid);
      z-index: 1;
      pointer-events: none;
    }
  }

  .padding {
    border: 1em solid rgb(196, 208, 140);
    height: 100%;
  }
`;

export function SizePreviewContent({ children }: { children: ReactNode }) {
  const {
    sizeAndSpace: { baselineGrid, baseFontSize },
  } = useConfigurationContext();
  const { showGrid } = useSizePreviewContext();
  return (
    <div
      style={{
        // @ts-expect-error custom properties are OK
        "--base-font-size": `${baseFontSize}px`,
        "--baseline-grid": `${baselineGrid}px`,
      }}
      className={classes(styles, {
        grid: showGrid,
      })}
    >
      <div className="padding">{children}</div>
    </div>
  );
}
