import {
  makeColor,
  makeCustom,
  makeFontWeight,
  makeRem,
} from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import { useIntervalState } from "../../buttery-components";

const containerStyles = css`
  width: 100%;
  background: white;
  padding: ${makeRem(64)} 0;

  & > div {
    max-width: ${makeCustom("layout-max-width")};
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    font-size: ${makeRem(54)};
    line-height: 1.5;
    text-transform: lowercase;

    span {
      &.primary,
      &.secondary {
        opacity: 1;
        border-radius: ${makeRem(8)};
        padding: 0 ${makeRem(16)};
      }
      &.primary {
        background-color: ${makeColor("primary", {
          variant: "50",
          opacity: 0.1,
        })};
        color: ${makeColor("primary", { variant: "900" })};
      }
      &.secondary {
        background-color: ${makeColor("secondary", {
          variant: "50",
          opacity: 0.1,
        })};
        padding: 0 1rem;
        color: ${makeColor("secondary", { variant: "900" })};
      }
      &.alt {
        /* text-decoration: underline; */
        /* font-weight: ${makeFontWeight("light")}; */
      }
    }
  }
  p {
    text-align: center;
    font-size: ${makeRem(24)};
    max-width: 60ch;
    margin: 0 auto;
  }
`;

const cardData: { title: string; name: string; description: string }[] = [
  {
    title: "scaling design systems", // is hard
    name: "Buttery tokens",
    description:
      "Use auto-generated type-safe utilities to easily define, use and scale your teams design tokens.",
  },
  {
    title: "interfacing component libraries",
    name: "buttery components",
    description:
      "Import, re-export, copy/paste, or programmatically generate the the hard stuff while styling with ANY methodology or framework.",
  },
  {
    title: "maintaining documentation",
    name: "buttery docs",
    description:
      "Create SSR, co-located .md and .mdx documentation. Stop downloading frameworks. Start writing docs.",
  },
  {
    title: "writing a CLI", // is hard
    name: "buttery commands",
    description:
      "Write complex and scale deeply nested CLI's like you're declaring routes for NextJS or Remix.",
  },
];

export function ButteryDocsHero() {
  const currentData = useIntervalState(cardData, { interval: 10_000 });

  return (
    <div className={containerStyles}>
      <div>
        <h1>
          <div>
            <span className="primary">{currentData.title}</span>{" "}
            <span className="alt">is hard</span>.
          </div>
          <div>
            <span className="secondary">{currentData.name}</span>
            <span className="alt"> makes it easy</span>
          </div>
        </h1>
        <p>{currentData.description}</p>
      </div>
    </div>
  );
}
