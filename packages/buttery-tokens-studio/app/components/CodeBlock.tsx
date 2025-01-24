import { classes } from "@buttery/components";
import { makeFontFamily, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";
import type { CodeToHastOptions, BundledLanguage, BundledTheme } from "shiki";

import { useHighlightCode } from "~/hooks/hook.useHighlightCode";

const styles = css`
  * {
    font-family: ${makeFontFamily("Consolas")};
    font-size: ${makeRem(14)};
  }

  pre {
    margin: 0;
    border-radius: ${makeRem(8)};
    padding: ${makeRem(16)};
    height: 100%;
    overflow-x: auto;
  }
`;

export type CodeBlockPropsNative = JSX.IntrinsicElements["div"];
export type CodeBlockPropsCustom = {
  dxCode: string;
  dxOptions?: Omit<CodeToHastOptions<BundledLanguage, BundledTheme>, "theme">;
};
export type CodeBlockProps = CodeBlockPropsNative & CodeBlockPropsCustom;

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  function CodeBlock(
    { children, className, dxCode, dxOptions = {}, ...restProps },
    ref
  ) {
    const code = useHighlightCode(dxCode, { lang: "json", ...dxOptions });

    return (
      <div
        {...restProps}
        className={classes(styles, className)}
        ref={ref}
        dangerouslySetInnerHTML={{ __html: code }}
      >
        {children}
      </div>
    );
  }
);
