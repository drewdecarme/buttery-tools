import { css } from "@linaria/core";
import { classes } from "@buttery/components";
import { makeColor, makeRem, makeReset } from "@buttery/tokens/playground";

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

const ulStyles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(16)};

  li {
    display: flex;
    gap: ${makeRem(8)};
  }

  input,
  button {
    font-size: 0.75em;
    padding: 0 1em;
  }

  .icon {
    display: grid;
    place-content: center;
    border: 1px solid ${makeColor("secondary-600")};
    font-size: 0.5em;
    border-radius: ${makeRem(4)};
  }
`;

export function SizePreviewContent() {
  const {
    sizeAndSpace: { baselineGrid, baseFontSize, size },
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
      <div className="padding">
        <ul className={ulStyles}>
          {Object.entries(size.variants).map(([variantId, variant]) => (
            <li key={variantId}>
              <button style={{ height: variant.value }}>
                btn - {variant.name}
              </button>
              <input
                style={{ height: variant.value }}
                value={`input - ${variant.name}`}
              />
              <div
                className="icon"
                style={{ height: variant.value, aspectRatio: "1 / 1" }}
              >
                icon
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
