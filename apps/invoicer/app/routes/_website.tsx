import { styled } from "@linaria/react";
import { Link } from "@remix-run/react";

const SLayout = styled("div")`
  display: grid;
  grid-template-rows: 80px auto auto;
  background: #000;

  header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
    padding: 0 2rem;
    max-width: 1024px;
    margin: 0 auto;
    width: 100%;
    align-items: center;

    nav {
      ul {
        display: flex;
        justify-content: center;
        gap: 1rem;
      }
    }

    a {
      color: #fff;
    }
  }

  main {
    min-height: 100vh;
  }
`;

export default function WebsitePage() {
  return (
    <SLayout>
      <header>
        <div>logo</div>
        <nav>
          <ul>
            <li>
              <Link to="/pricing">Pricing</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
        <div>
          <Link to="/clients">Go to Dashboard</Link>
        </div>
      </header>
      <main>main</main>
      <footer>footer</footer>
    </SLayout>
  );
}
