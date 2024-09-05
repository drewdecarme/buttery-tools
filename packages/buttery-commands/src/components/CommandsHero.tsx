import { css } from "@linaria/core";

const hero = css`
  max-width: 100%;
  display: grid;
  grid-template-columns: auto minmax(30%, 70%);
  height: min-content;
  background: white;
  padding-right: 4rem;
  padding-left: 4rem;
  gap: 4rem;
  position: relative;
  align-items: center;

  .blob {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
  }

  .hero-img {
    width: 100%;
    object-fit: contain;
    height: 80vh;
    z-index: 10;
  }

  .title {
    z-index: 10;
  }

  h1 {
    font-size: 64px;
    line-height: 1;
    position: relative;
   margin: 0;
   padding: 0;
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
`;

export function CommandsHero() {
  return (
    <div className={hero}>
      <img className="blob" src="/images/hero-bg.png" alt="bg" />
      <div className="title">
        <h1>Authoring CLIs doesn't have to suck.</h1>
        <p>
          Write a 100% Type-safe NodeJS CLI simply by exporting a few variables
          from a file. <strong>It's that simple.</strong>
        </p>
      </div>
      <img src="/images/hero-img.png" alt="hero-2" className="hero-img" />
    </div>
  );
}
