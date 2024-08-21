import { css } from "@linaria/core";

const heroStyles = css`
  width: 100%;
  position: relative;
  height: min-content;
  background: rgb(30, 29, 28);
  display: grid;
  grid-template-columns: 50% 1fr;

  img {
    bottom: 0;
    width: 100%;
    left: 0;
    align-self: center;
    object-fit: contain;
  }

  .title {
    padding-left: 4rem;
    padding-right: 4rem;
    color: white;

    h1 {
      font-size: 64px;
      line-height: 1;
      position: relative;
      padding-top: 4rem;

      margin-bottom: 2rem;
      padding-bottom: 1rem;

      & > span {
        text-decoration: underline;
        font-style: italic;
        color: #f6c539;
      }
    }
    p {
      font-size: 24px;
      line-height: 1.4;

      & + div {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
      }
    }
  }
`;

export function Hero() {
  return (
    <div className={heroStyles}>
      <img src="/buttery-components-hero.png" alt="buttery-components-hero" />
      <div className="title">
        <h1>
          Stop <span>re-writing</span> the hard stuff.
        </h1>
        <p>
          100% unstyled and completely WCAG AA compliant hooks and components
          that actually help you increase your development velocity and let YOU
          decide how they should be styled.
        </p>
      </div>
    </div>
  );
}
