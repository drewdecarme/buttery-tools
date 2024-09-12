import { makeColor, makeFontWeight, makeRem } from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import { NavLink } from "@remix-run/react";
import type { FC } from "react";
import type { ButteryDocsGraph } from "../../../../.buttery/commands/docs/docs.types";

const ulStyles = css`
  list-style-type: none;
  padding-left: 0;
  margin-left: 0;
  position: relative;

  & {
    li {
      margin-left: ${makeRem(16)};
      &:before {
        content: "";
        position: absolute;
        left: ${makeRem(8)};
        top: 0;
        bottom: 0;
        width: ${makeRem(1)};
        background: ${makeColor("neutral", { variant: "50" })};
      }
    }
  }

  li {
    padding: 0;
  }
`;

const anchorCss = css`
  height: ${makeRem(24)};
  text-decoration: none;
  color: ${makeColor("neutral")};
  padding: ${makeRem(2)} ${makeRem(8)};
  border-radius: ${makeRem(4)};
  font-size: ${makeRem(14)};
  display: flex;
  align-items: center;
  margin-bottom: ${makeRem(4)};
  transition: all 0.15s ease-in-out;

  &:visited {
    color: inherit;
  }

  &.active {
    background: ${makeColor("primary", { variant: "300", opacity: 0.2 })};
    color: ${makeColor("primary")};
    font-weight: ${makeFontWeight("semi-bold")};
  }
  &:not(.active) {
    &:hover {
      background: ${makeColor("primary", { variant: "200", opacity: 0.2 })};
      color: ${makeColor("primary")};
      font-weight: ${makeFontWeight("semi-bold")};
    }
  }
`;

/**
 * Recursive component designed to create a sidebar tree form
 * nested pages.
 */
export type NavItemProps = {
  graph: ButteryDocsGraph;
};
export const LayoutBodyNavItem: FC<NavItemProps> = ({ graph }) => {
  return (
    <ul className={ulStyles}>
      {Object.entries(graph).map(([graphKey, graphValue]) => {
        return (
          <li key={graphKey}>
            <NavLink to={graphValue.routeAbs} className={anchorCss} end>
              {graphValue.routeTitle}
            </NavLink>
            {Object.entries(graphValue.pages).length > 0 ? (
              <LayoutBodyNavItem graph={graphValue.pages} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};