import { css } from "@linaria/core";

const imgStyles = css`
  width: 100%;
`;

export function ButteryDocsHero() {
  return (
    <img
      src="/images/happy-butter-man.webp"
      alt="happy-butter-man"
      className={imgStyles}
    />
  );
}
