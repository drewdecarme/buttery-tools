import {
  makeColorBrand,
  makeCustom,
  makeRem,
  makeReset,
} from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import { useIntervalState } from "../../buttery-components/hooks/useIntervalState";
import { classes } from "../../buttery-components/utils";

const containerStyles = css`
  width: 100%;
  background: white;
  padding: ${makeRem(64)} 0;
  min-height: 100vh;

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
        transition: all 0.25s ease-in-out;
        opacity: 1;
        transform: translateY(0);
      }
      &.primary {
        background-color: ${makeColorBrand("primary", {
          variant: "50",
          opacity: 0.1,
        })};
        color: ${makeColorBrand("primary", { variant: "900" })};
      }
      &.secondary {
        background-color: ${makeColorBrand("secondary", {
          variant: "50",
          opacity: 0.1,
        })};
        padding: 0 1rem;
        color: ${makeColorBrand("secondary", { variant: "900" })};
      }

      &.entering {
        opacity: 1;
        transform: translateY(0);
      }

      &.exiting {
        opacity: 0;
        transform: translateY(-20px);
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

const cardContainerStyles = css`
  ${makeReset("ul")};
  margin: ${makeRem(36)} auto;
  position: relative;
  width: 70%; /* Use a percentage of the viewport width */
  height: 60vh; /* Use a percentage of the viewport height */
`;

const cardStyles = css`
  position: absolute;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  background-color: #fff;

  border-radius: ${makeRem(8)};
  transition: all 1s ease-in-out; /* Smooth transition for transform and opacity */
  height: 100%;
  width: 100%;
  opacity: 0;

  &.prev,
  &.next {
    scale: 0.8;
    opacity: 0.7;
  }

  &.prev {
    transform: translateX(-300px);
  }

  &.front {
    transform: translateX(0);
    z-index: 10;
    opacity: 1;
  }

  &.next {
    transform: translateX(300px);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    border-radius: inherit;
  }
`;

// const overlineStyles = css`
//   font-size: ${makeRem(16)};
//   text-transform: uppercase;
//   font-weight: ${makeFontWeight("bold")};
//   margin: 0 auto;
//   text-align: center;
// `;

const cardData: {
  title: string;
  name: string;
  description: string;
  imgSrc: string;
  imgAlt: string;
}[] = [
  {
    title: "scaling design systems", // is hard
    name: "Buttery tokens",
    description:
      "Use auto-generated type-safe utilities to easily define, use and scale your teams design tokens.",
    imgSrc: "/images/sample-buttery-docs.png",
    imgAlt: "buttery-docs-sample",
  },
  {
    title: "interfacing component libraries",
    name: "buttery components",
    description:
      "Import, re-export, copy/paste, or programmatically generate the the hard stuff while styling with ANY methodology or framework.",
    imgSrc: "/images/sample-buttery-docs.png",
    imgAlt: "buttery-docs-sample",
  },
  {
    title: "maintaining documentation",
    name: "buttery docs",
    description:
      "Create SSR, co-located .md and .mdx documentation. Stop downloading frameworks. Start writing docs.",
    imgSrc: "/images/sample-buttery-docs.png",
    imgAlt: "buttery-docs-sample",
  },
  {
    title: "writing a CLI", // is hard
    name: "buttery commands",
    description:
      "Write complex and scale deeply nested CLI's like you're declaring routes for NextJS or Remix.",
    imgSrc: "/images/sample-buttery-commands.png",
    imgAlt: "buttery-commands-sample",
  },
];

export function ButteryDocsHero() {
  const { currentData, animationClassName, currentIndex } = useIntervalState(
    cardData,
    {
      interval: 10_000,
      transitionDuration: 0.25,
    }
  );

  return (
    <>
      <div className={containerStyles}>
        <div>
          {/* <div className={overlineStyles}>buttery tools</div> */}
          <h1>
            <div>
              <span className={classes("primary", animationClassName)}>
                {currentData.title}
              </span>{" "}
              <span className="alt">is hard</span>.
            </div>
            <div>
              <span className={classes("secondary", animationClassName)}>
                {currentData.name}
              </span>
              <span className="alt"> makes it easy.</span>
            </div>
          </h1>
          <p>{currentData.description}</p>
        </div>
        <ul className={cardContainerStyles}>
          {cardData.map((card, index) => {
            // Calculate the offset from the currentIndex
            const offset =
              (index - currentIndex + cardData.length) % cardData.length;

            return (
              <li
                key={card.name}
                className={classes(cardStyles, {
                  front: offset === 0,
                  next: offset === 1,
                  prev: offset === cardData.length - 1,
                })}
              >
                <img src={card.imgSrc} alt={card.imgAlt} />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
