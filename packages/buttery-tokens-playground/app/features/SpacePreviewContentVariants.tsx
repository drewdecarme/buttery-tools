import { css } from "@linaria/core";
import { makeColor, makeRem, makeReset } from "@buttery/tokens/playground";
import { Fragment } from "react/jsx-runtime";

import type { ConfigurationStateSizeAndSpace_SpaceVariants } from "./config.utils.sizing.js";

const styles = css`
  ${makeReset("ul")};

  font-size: ${makeRem(12)};
  display: grid;
  grid-template-columns: auto auto auto 1fr;
  grid-template-rows: auto;
  gap: ${makeRem(16)};
  align-items: center;

  .px,
  .rem {
    color: ${makeColor("neutral-light", { opacity: 0.6 })};
  }

  .bar {
    height: 100%;
    background: ${makeColor("secondary-300")};
  }
`;

export function SpacePreviewContentVariants(props: {
  baseFontSize: number;
  variants: ConfigurationStateSizeAndSpace_SpaceVariants;
}) {
  return (
    <div className={styles}>
      {Object.entries(props.variants).map(([id, { name, value }]) => (
        <Fragment key={id}>
          <div>{name}</div>
          <div className="px">{value}px</div>
          <div className="rem">{value / props.baseFontSize}rem</div>
          <div className="bar" style={{ height: value }} />
        </Fragment>
      ))}
    </div>
  );
}
