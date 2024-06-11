import { makeColor, makeFontWeight, makeRem } from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import type { FC } from "react";
import { useLayoutContext } from "./Layout.context";

const SLayoutHeader = styled("header")`
  grid-area: layout-header;
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  padding: 0 ${makeRem(32)};
  border-bottom: ${makeRem(1)} solid
    ${makeColor("neutral", { variant: "50", opacity: 0.5 })};

  & > div {
    height: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 100%;
    gap: ${makeRem(16)};
    max-width: ${makeRem(1440)};
  }
`;

const SAnchor = styled("a")`
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
  const { header } = useLayoutContext();

  return (
    <SLayoutHeader>
      <div>
        {header && (
          <SAnchor href="/">
            {header?.logo && (
              <SImg src={header.logo.src} alt={header.logo.alt} />
            )}
            {header?.title && <SDiv>{header.title}</SDiv>}
          </SAnchor>
        )}
        <div>
          <button type="button">test 1</button>
        </div>
      </div>
    </SLayoutHeader>
  );
};
