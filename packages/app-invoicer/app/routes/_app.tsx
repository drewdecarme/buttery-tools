import { UserButton } from "@clerk/remix";
import { styled } from "@linaria/react";
import { Outlet, NavLink, useMatches } from "@remix-run/react";
import { DocDetail, Home, UserBusiness } from "@icon-park/react";

const SDashboard = styled("main")`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(min-content, auto) 1fr;
  background: rgb(246, 247, 251);
`;

const SDashboardSideNav = styled("nav")`
  padding: 0.25rem;

  ul {
    background: rgb(0, 0, 0);
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0;
    gap: 1rem;
    border-radius: 8px;

    li {
      padding: 0 1rem;

      a {
        height: 48px;
        width: 48px;
        display: block;
        display: grid;
        place-items: center;
        border-radius: 4px;
        color: white;

        &:not(.active):hover {
          background: rgb(112, 36, 245, 0.5);
        }

        &.active {
          background: rgb(112, 36, 245);
          color: white;
        }
      }
    }
  }
`;

const SDashboardMain = styled("section")`
  padding: 0.25rem 0;
  display: grid;
  grid-template-rows: 64px 1fr;
`;

const SDashboardMainHeader = styled("header")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;

  & > div {
    display: flex;
    gap: 2rem;
  }
`;

const SDashboardMainBody = styled("div")`
  padding: 0 2rem;
  max-width: 1200px;

  h1 {
    margin-top: 0;
  }
`;

const SBreadcrumbs = styled("ol")`
  display: flex;
  align-items: center;
  gap: 1rem;

  a,
  span {
    font-size: 12px;
    &:not(.active) {
      color: #898989;
    }
  }
`;

export default function DashboardPage() {
  const matches = useMatches();

  return (
    <SDashboard>
      <SDashboardSideNav>
        <ul>
          <li>
            <NavLink to="/dashboard" end>
              <Home size={24} strokeWidth={2} />
            </NavLink>
          </li>
          <li>
            <NavLink to="/clients">
              <UserBusiness size={24} strokeWidth={2} />
            </NavLink>
          </li>
          <li>
            <NavLink to="/invoice">
              <DocDetail size={24} strokeWidth={2} />
            </NavLink>
          </li>
        </ul>
      </SDashboardSideNav>
      <SDashboardMain>
        <SDashboardMainHeader>
          <SBreadcrumbs>
            {matches
              // @ts-ignore
              .filter((match) => match.handle && match.handle.breadcrumb)
              .map((match, index) => (
                // @ts-ignore
                <li key={index}>{match.handle.breadcrumb(match)}</li>
              ))}
          </SBreadcrumbs>
          <UserButton />
        </SDashboardMainHeader>
        <SDashboardMainBody>
          <Outlet />
        </SDashboardMainBody>
      </SDashboardMain>
    </SDashboard>
  );
}
