import { IconComponent } from "@buttery/icons";
import {
  makeColor,
  makeFontFamily,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import { NavLink } from "@remix-run/react";
import { DropdownNav, useDropdownNav } from "../../../buttery-components";
import type { ButteryConfigDocsHeaderLinkTypeDropdown } from ".buttery/commands/_buttery-config";

const buttonStyles = css`
  ${makeReset("button")};
  font-size: ${makeRem(16)};
  font-family: ${makeFontFamily("body")};
  cursor: pointer;

  display: flex;
  gap: ${makeRem(8)};
  align-items: center;

  &:hover {
    color: ${makeColor("primary")};
  }

  &.active {
    color: ${makeColor("primary")};
    font-weight: ${makeFontWeight("bold")};
  }
`;

const dropdownStyles = css`
  opacity: 0;
  border: none;
  transform: scale(0.9);
  filter: drop-shadow(3px 8px 28px rgba(130, 130, 130, 0.3));
  border-radius: 0.5rem;
  padding: 0;
  min-width: 200px;

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

  ul {
    ${makeReset("ul")};
    padding: ${makeRem(16)} 0;

    a {
      ${makeReset("anchor")};
      font-family: ${makeFontFamily("body")};
      display: grid;
      grid-template-columns: ${makeRem(48)} auto;
      gap: ${makeRem(8)};
      align-items: center;
      padding: ${makeRem(8)} ${makeRem(16)};

      img {
        max-height: ${makeRem(36)};
        justify-self: center;
        align-self: middle;
        max-width: auto;
        object-fit: contain;
        place-content: center;
      }

      .title {
        font-size: ${makeRem(16)};
        font-weight: ${makeFontWeight("semi-bold")};
      }

      .sub-title {
        font-size: ${makeRem(14)};
        color: ${makeColor("neutral", { variant: "500" })};
        /* font-style: italic; */
      }

      &.active,
      &:hover {
        .title,
        .sub-title {
          color: ${makeColor("primary")};
        }
      }
    }
  }
`;

export function LayoutHeaderLinksTypeDropdown(
  props: ButteryConfigDocsHeaderLinkTypeDropdown
) {
  const { targetProps, dropdownProps } = useDropdownNav({
    dxOffset: 16,
    dxPosition: "bottom-right",
  });

  return (
    <>
      <button type="button" {...targetProps} className={buttonStyles}>
        {props.text}
        <IconComponent icon="arrow-down-stroke-rounded" ddSize={24} />
      </button>
      <DropdownNav {...dropdownProps} className={dropdownStyles}>
        <ul>
          {props.items.map((item) => {
            return (
              <li key={item.href}>
                <NavLink to={item.href}>
                  <img src={item.iconSrc} alt={item.iconAlt} />
                  <div>
                    <div className="title">{item.text}</div>
                    {item.subText && (
                      <div className="sub-title">{item.subText}</div>
                    )}
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </DropdownNav>
    </>
  );
}
