export { useMenu, useMenuContext } from "@buttery/components";

import {
  Menu as ButteryMenu,
  type MenuProps,
  type MenuRef,
  classes,
} from "@buttery/components";
import { makeRem } from "@buttery/tokens/docs";
import { makeFontWeight } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { forwardRef } from "react";

const menuCSS = css`
  opacity: 0;
  border: none;
  transform: scale(0.9);
  filter: drop-shadow(3px 8px 28px rgba(130, 130, 130, 0.3));
  border-radius: 0.5rem;

  header {
    padding: 1rem;
    h1,
    h2 {
      margin: 0;
    }
  }
  & > div {
    padding: 0 1rem;
  }
  footer {
    padding: 1rem;
  }

  /* Animation for appearing */
  @keyframes appear {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Animation for disappearing */
  @keyframes disappear {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.9);
    }
  }

  &.open {
    animation: appear 0.15s forwards;
  }

  &.close {
    animation: disappear 0.15s forwards;
  }
`;

export const Menu = forwardRef<MenuRef, MenuProps>(function Menu(
  { children, className, ...restProps },
  ref
) {
  return (
    <ButteryMenu
      {...restProps}
      className={classes(className, menuCSS)}
      ref={ref}
    >
      {children}
    </ButteryMenu>
  );
});

export const MenuHeader = styled("header")`
  h1,
  h2,
  h3 {
    font-weight: ${makeFontWeight("semi-bold")};
    margin: 0;
    font-size: ${makeRem(16)};
  }
`;

export const MenuFooter = styled("footer")`
  display: flex;
  justify-content: flex-end;
  gap: ${makeRem(16)};
`;
