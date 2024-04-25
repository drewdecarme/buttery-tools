import { UserButton } from "@clerk/remix";
import { withAuthentication } from "../utils/clerk";
import { styled } from "@linaria/react";
import { Link, Outlet, useLoaderData, json } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getPrismaClient } from "../utils/prisma";

const SDashboard = styled("main")`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 300px 1fr;
`;

const SDashboardSideNav = styled("nav")`
  background: rgb(247, 247, 247);
`;

const SDashboardMain = styled("section")`
  background: #fff;
  display: grid;
  grid-template-rows: 100px 1fr;
`;

const SDashboardMainHeader = styled("header")`
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
`;

const SDashboardMainBody = styled("div")`
  padding: 2rem;
`;

export const loader = withAuthentication(async ({ prisma, user_id }) => {
  const clients = await prisma.client.findMany({
    where: {
      user_id,
    },
  });
  return json(clients);
});

export default function DashboardPage() {
  const clients = useLoaderData<typeof loader>();

  return (
    <SDashboard>
      <SDashboardSideNav>
        <ul>
          <li>
            <Link to="clients">Clients</Link>
          </li>
        </ul>
      </SDashboardSideNav>
      <SDashboardMain>
        <SDashboardMainHeader>
          <div>
            <select defaultValue="">
              <option value="" disabled>
                Select a client
              </option>
              {clients.map((client) => (
                <option key={client.id} value={client.name}>
                  {client.name}
                </option>
              ))}
            </select>
            <Link to="/dashboard/clients/new">Add Client</Link>
          </div>
          <UserButton />
        </SDashboardMainHeader>
        <SDashboardMainBody>
          <Outlet />
        </SDashboardMainBody>
      </SDashboardMain>
    </SDashboard>
  );
}
