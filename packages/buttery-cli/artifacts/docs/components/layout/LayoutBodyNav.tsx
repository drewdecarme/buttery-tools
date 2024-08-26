import {
  makeColor,
  makeCustom,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import { NavLink } from "@remix-run/react";
import clsx from "clsx";
import { type FC, useMemo } from "react";
import type { ButteryDocsGraph } from "../../../../.buttery/commands/docs/docs.types";
import { useLayoutContext } from "./layout.useLayoutContext";
import { layoutNavOverlineCSS } from "./layout.utils";

const navStyles = css`
  grid-area: layout-sidebar;
  align-self: start;
  border-right: ${makeRem(1)} solid
    ${makeColor("neutral", { variant: "50", opacity: 0.5 })};
  max-height: ${`calc(100% - ${makeCustom("layout-header-height")})`};
  overflow-y: auto;
  position: sticky;
  top: ${makeCustom("layout-header-height")};
  align-self: start;
`;

const navContentStyles = css`
  position: sticky;
  padding: ${makeRem(32)};
  top: ${makeCustom("layout-header-height")};
  h1 {
    margin: 0;
  }
`;

const sectionStyles = css`
  margin-bottom: ${makeRem(16)};
  & + & {
    padding-top: ${makeRem(16)};
    border-top: ${makeRem(1)} solid
      ${makeColor("neutral", { variant: "50", opacity: 0.5 })};
  }
`;

// const ulStyles = css`
//   list-style-type: none;
//   padding-left: 0;
//   margin-left: 0;
//   position: relative;

//   & {
//     li {
//       margin-left: ${makeRem(16)};
//       &:before {
//         content: "";
//         position: absolute;
//         left: ${makeRem(8)};
//         top: 0;
//         bottom: 0;
//         width: ${makeRem(1)};
//         background: ${makeColor("neutral", { variant: "50" })};
//       }
//     }
//   }

//   li {
//     padding: 0;
//   }
// `;

// const anchorCss = css`
//   height: ${makeRem(24)};
//   text-decoration: none;
//   color: ${makeColor("neutral")};
//   padding: ${makeRem(2)} ${makeRem(8)};
//   border-radius: ${makeRem(4)};
//   font-size: ${makeRem(14)};
//   display: flex;
//   align-items: center;
//   margin-bottom: ${makeRem(4)};
//   transition: all 0.15s ease-in-out;

//   &:visited {
//     color: inherit;
//   }

//   &.active {
//     background: ${makeColor("primary", { variant: "300", opacity: 0.2 })};
//     color: ${makeColor("primary")};
//     font-weight: ${makeFontWeight("semi-bold")};
//   }
//   &:not(.active) {
//     &:hover {
//       background: ${makeColor("primary", { variant: "200", opacity: 0.2 })};
//       color: ${makeColor("primary")};
//       font-weight: ${makeFontWeight("semi-bold")};
//     }
//   }
// `;

const anchorOverlineCSS = css`
  ${makeReset("anchor")};
  transition: all 0.15s ease-in-out;

  &.active,
  &:hover {
    & > * {
      font-weight: ${makeFontWeight("bold")};
      color: ${makeColor("primary")};
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
// const NavItem: FC<NavItemProps> = ({ graph }) => {
//   return (
//     <ul className={ulStyles}>
//       {Object.entries(graph).map(([graphKey, graphValue]) => {
//         return (
//           <li key={graphKey}>
//             <NavLink to={graphValue.routeAbs} className={anchorCss} end>
//               {graphValue.routeTitle}
//             </NavLink>
//             {Object.entries(graphValue.pages).length > 0
//               ? NavItem({ graph: graphValue.pages })
//               : null}
//           </li>
//         );
//       })}
//     </ul>
//   );
// };

export const LayoutBodyNav: FC = () => {
  const { graph } = useLayoutContext();
  return (
    <nav className={navStyles}>
      <div className={navContentStyles}>
        {Object.entries(graph).map(([sectionKey, sectionValues]) => {
          if (sectionKey === "_index") return null;
          return (
            <section key={sectionKey} className={sectionStyles}>
              <NavLink
                to={sectionValues.routeAbs}
                className={anchorOverlineCSS}
              >
                <h1 className={layoutNavOverlineCSS}>
                  {sectionValues.routeTitle}
                </h1>
              </NavLink>
              {/* <NavItem graph={sectionValues.pages} /> */}
            </section>
          );
        })}
      </div>
    </nav>
  );
};
