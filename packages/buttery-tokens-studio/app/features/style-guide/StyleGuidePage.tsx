import { classes } from "@buttery/components";
import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type StyleGuidePagePropsNative = JSX.IntrinsicElements["section"];
export type StyleGuidePageProps = StyleGuidePagePropsNative;

const styles = css`
  display: grid;
  grid-template-columns: ${`minmax(min-content, ${makeRem(300)}) auto`};
  gap: ${makeRem(32)};
  margin-bottom: ${makeRem(64)};

  .right {
    padding: 0 ${makeRem(32)};
  }
`;

export const StyleGuidePage = forwardRef<HTMLElement, StyleGuidePageProps>(
  function StyleGuidePage({ children, className, ...restProps }, ref) {
    return (
      <section {...restProps} className={classes(styles, className)} ref={ref}>
        {children}
      </section>
    );
  }
);
