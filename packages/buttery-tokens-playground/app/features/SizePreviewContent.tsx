import { css } from "@linaria/core";
import { classes } from "@buttery/components";
import { makeRem } from "@buttery/tokens/playground";

import { useSizePreviewContext } from "./SizePreview.context";
import { useConfigurationContext } from "./Config.context";

const styles = css`
  position: relative;
  height: ${makeRem(160 * 2 + 1)};
  margin: 0 auto auto auto;
  background-color: #fff;
  overflow: hidden;
  aspect-ratio: 1 / 1;

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
    /* border-right: 1px solid rgba(0, 0, 0, 0.1); */
  }
`;

export function SizePreviewContent() {
  const {
    sizeAndSpace: { baselineGrid },
  } = useConfigurationContext();
  const { showGrid } = useSizePreviewContext();
  return (
    <div
      style={{
        // @ts-expect-error custom properties are OK
        "--baseline-grid": `${baselineGrid}px`,
      }}
      className={classes(styles, {
        grid: showGrid,
      })}
    ></div>
  );
}
