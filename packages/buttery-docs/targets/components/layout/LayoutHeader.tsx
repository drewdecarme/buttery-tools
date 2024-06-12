import {
  makeColor,
  makeColorStatic,
  makeCustom,
  makeFontWeight,
  makeRem,
} from "@buttery/tokens/_docs";
import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import type { FC } from "react";
import { LayoutHeaderLinks } from "./LayoutHeaderLinks";
import { useLayoutContext } from "./layout.useLayoutContext";

const SLayoutHeader = styled("header")`
  grid-area: layout-header;
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  padding: 0 ${makeRem(32)};
  border-bottom: ${makeRem(1)} solid
    ${makeColor("neutral", { variant: "50", opacity: 0.5 })};
  background: ${makeColorStatic("background")};
  z-index: 10;

  & > div {
    flex: 1;
    height: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 100%;
    gap: ${makeRem(16)};
    max-width: ${makeCustom("layout-max-width")};
    margin: 0 auto;

    & > div:last-child {
      display: flex;
      justify-content: flex-end;
    }
  }
`;

const anchorCSS = css`
  margin: 0;
  padding: 0;
  text-decoration: none;
  height: 100%;
  display: block;
  display: flex;
  align-items: center;
  gap: ${makeRem(16)};

  &:visited {
    color: inherit;
  }
`;

const SImg = styled("img")`
  height: 60%;
  width: auto;
  object-fit: contain;
`;

const SDiv = styled("div")`
  font-size: ${makeRem(16)};
  text-transform: uppercase;
  color: ${makeColor("neutral")};
  font-weight: ${makeFontWeight("bold")};
`;

export const LayoutHeader: FC = () => {
  const { header, NavLinkComponent } = useLayoutContext();

  return (
    <SLayoutHeader>
      <div>
        {header && (
          <NavLinkComponent href="/" className={anchorCSS}>
            {header?.logo && (
              <SImg src={header.logo.src} alt={header.logo.alt} />
            )}
            {header?.title && <SDiv>{header.title}</SDiv>}
          </NavLinkComponent>
        )}
        <div>
          <LayoutHeaderLinks links={header?.links} />
        </div>
      </div>
    </SLayoutHeader>
  );
};
