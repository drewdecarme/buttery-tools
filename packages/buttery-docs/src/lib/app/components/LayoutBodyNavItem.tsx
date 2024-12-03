import { classes } from "@buttery/components";
import type { ButteryDocsRouteManifestGraphObject } from "@buttery/core/config";
import {
  makeColorBrand,
  makeColorShade,
  makeFontWeight,
  makeRem,
} from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import type { FC } from "react";
import { NavLink } from "react-router";

const ulStyles = css`
  list-style-type: none;
  padding-left: 0;
  margin-left: 0;
  position: relative;

  &.nested {
    li {
      margin-left: ${makeRem(16)};

      &:before {
        content: "";
        position: absolute;
        left: ${makeRem(8)};
        top: 0;
        bottom: 0;
        width: ${makeRem(1)};
        background: ${makeColorShade("neutral", { variant: "50" })};
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
  color: ${makeColorShade("neutral")};
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
    background: ${makeColorBrand("primary", { variant: "300", opacity: 0.2 })};
    color: ${makeColorBrand("primary")};
    font-weight: ${makeFontWeight("semi-bold")};
  }
  &:not(.active) {
    &:hover {
      background: ${makeColorBrand("primary", {
        variant: "200",
        opacity: 0.2,
      })};
      color: ${makeColorBrand("primary")};
      font-weight: ${makeFontWeight("semi-bold")};
    }
  }
`;

/**
 * Recursive component designed to create a sidebar tree form
 * nested pages.
 */
export type NavItemProps = {
  graph: ButteryDocsRouteManifestGraphObject;
  isNested?: boolean;
};
export const LayoutBodyNavItem: FC<NavItemProps> = ({
  graph,
  isNested = false,
}) => {
  return (
    <ul className={classes(ulStyles, { nested: isNested })}>
      {Object.entries(graph).map(([graphKey, graphValue]) => {
        return (
          <li key={graphKey}>
            <NavLink to={graphValue.routePath} className={anchorCss} end>
              {graphValue.fileNameFormatted}
            </NavLink>
            {Object.entries(graphValue.pages).length > 0 ? (
              <LayoutBodyNavItem graph={graphValue.pages} isNested />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};
