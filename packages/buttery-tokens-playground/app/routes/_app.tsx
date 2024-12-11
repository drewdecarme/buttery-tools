import { Link, Outlet } from "@remix-run/react";

export function AppRoute() {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/config">config</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
