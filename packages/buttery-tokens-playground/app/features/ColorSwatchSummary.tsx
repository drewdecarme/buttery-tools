import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { ReactNode } from "react";

const styles = css`
  display: grid;
  grid-template-columns: ${makeRem(24)} 1fr;
  gap: ${makeRem(16)};
  align-items: center;

  h4 {
    margin: 0;
    margin-bottom: ${makeRem(4)};
    font-size: ${makeRem(16)};
  }

  .color {
    width: ${makeRem(28)};
  }

  .sub-title {
    font-size: ${makeRem(14)};
  }
`;

export function ColorSwatchSummary(props: {
  children: ReactNode;
  dxTitle: string;
  dxSubtitle: string;
}) {
  return (
    <div className={styles}>
      <div>{props.children}</div>
      <div>
        <h4>{props.dxTitle}</h4>
        <div className="sub-title">{props.dxSubtitle}</div>
      </div>
    </div>
  );
}
