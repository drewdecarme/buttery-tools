import { classes } from "@buttery/components";
import { makeColor, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type StyleGuidePagePropsNative = JSX.IntrinsicElements["section"];
export type StyleGuidePageProps = StyleGuidePagePropsNative;

const styles = css`
  display: grid;
  grid-template-columns: ${`${makeRem(300)} auto`};
  gap: ${makeRem(32)};
  padding-bottom: ${makeRem(100)} !important;

  &:not(:last-child) {
    border-bottom: 1px solid ${makeColor("neutral-light", { opacity: 0.2 })};
    margin-bottom: ${makeRem(100)};
  }
`;

export const StyleGuidePage = forwardRef<HTMLElement, StyleGuidePageProps>(
  function StyleGuidePage({ children, className, ...restProps }, ref) {
    return (
      <section
        {...restProps}
        className={classes(styles, "page", className)}
        ref={ref}
      >
        {children}
      </section>
    );
  }
);
