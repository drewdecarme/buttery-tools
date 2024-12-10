import { makeColor, makeCustom, makeRem } from "@buttery/tokens/docs";
import { css } from "@linaria/core";

const footerStyles = css`
  width: 100%;

  & > div {
    max-width: ${makeCustom("layout-max-width")};
    border-top: ${makeRem(1)} solid
      ${makeColor("neutral-100", { opacity: 0.3 })};
    height: ${makeRem(80)};
    display: flex;
    justify-content: space-between;
    background: ${makeColor("background")};
    padding: 0 ${makeRem(32)};
    align-items: center;
  }
`;

export function ButteryDocsFooter() {
  return (
    <footer className={footerStyles}>
      <div>
        <div>© Buttery Tools 2024</div>
        <div>
          Created by{" "}
          <a
            href="https://github.com/drewdecarme"
            target="_blank"
            rel="noreferrer"
          >
            Drew DeCarme
          </a>
        </div>
      </div>
    </footer>
  );
}
