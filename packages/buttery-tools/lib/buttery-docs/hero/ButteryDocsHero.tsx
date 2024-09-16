import { makeRem } from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import { useIntervalState } from "../../buttery-components";

const containerStyles = css`
  width: 100%;
  background: white;
`;

const cardStyles = css`
  width: ${makeRem(300)};
  height: max-content;
  padding: 2rem;
  background: white;
`;

const cardData: { title: string; subTitle: string }[] = [
  {
    title: "interfacing component libraries",
    subTitle: "this is random",
  },
  {
    title: "maintaining documentation",
    subTitle: "this is random",
  },
  {
    title: "writing a CLI", // is hard
    subTitle: "this is random",
  },
  {
    title: "scaling design systems", // is hard
    subTitle: "this is random",
  },
];

export function ButteryDocsHero() {
  const currentData = useIntervalState(cardData, { interval: 5_000 });

  return (
    <div className={containerStyles}>
      <h1>{currentData.title}</h1>
    </div>
  );
}
