// import { IconComponent } from "@buttery/icons";
import {
  makeColorBrand,
  makeColorShade,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import { NavLink } from "@remix-run/react";
import type { FC } from "react";
import { match } from "ts-pattern";
import type { ButteryConfigDocsHeaderLink } from "../../../../.buttery/commands/_buttery-config";
import { LayoutHeaderLinksTypeDropdown } from "./LayoutHeaderLinksTypeDropdown";

const divStyles = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ulStyles = css`
  ${makeReset("ul")};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;

  & + * {
    padding-left: ${makeRem(16)};
    margin-left: ${makeRem(16)};
    border-left: ${makeRem(1)} solid
      ${makeColorShade("neutral", { variant: "50" })};
  }
`;

const anchorSocialStyles = css`
  ${makeReset("anchor")};
  display: grid;
  place-content: center;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: ${makeColorBrand("primary")};
  }
`;

const internalCss = css`
  ${makeReset("anchor")};
  display: grid;
  place-content: center;
  transition: all 0.15s ease-in-out;
  font-size: ${makeRem(16)};

  &:hover {
    color: ${makeColorBrand("primary")};
    text-decoration: underline;
  }

  &.active {
    color: ${makeColorBrand("primary")};
    font-weight: ${makeFontWeight("bold")};
  }
`;

export const LayoutHeaderLinks: FC<{
  links?: ButteryConfigDocsHeaderLink[][];
}> = ({ links = [] }) => {
  return (
    <div className={divStyles}>
      {links.map((linkSection, i) => {
        return (
          <ul className={ulStyles} key={`section-${i.toString()}`}>
            {linkSection.map((link, i) => {
              return (
                <li key={"links".concat(i.toString())}>
                  {match(link)
                    .with({ type: "dropdown" }, (dropdownLink) => {
                      return (
                        <LayoutHeaderLinksTypeDropdown {...dropdownLink} />
                      );
                    })
                    .with({ type: "social" }, (socialLink) => {
                      return (
                        <a
                          className={anchorSocialStyles}
                          href={socialLink.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={socialLink.label}
                        >
                          {/* <IconComponent
                            icon="github-circle-solid-rounded"
                            ddSize={makeRem(28)}
                          /> */}
                        </a>
                      );
                    })
                    .with({ type: "text" }, (socialLink) => {
                      return <a href={socialLink.href}>{socialLink.text}</a>;
                    })
                    .with({ type: "internal" }, (internalLink) => {
                      return (
                        <NavLink to={internalLink.href} className={internalCss}>
                          {internalLink.text}
                        </NavLink>
                      );
                    })
                    .exhaustive()}
                </li>
              );
            })}
          </ul>
        );
      })}
    </div>
  );
};
