import { Link, NavLink, Outlet, json, useLoaderData } from "@remix-run/react";
import { withAuthentication } from "../utils/clerk";
import { styled } from "@linaria/react";

const SClientCards = styled("ul")`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 200px));
  gap: 20px;
`;

// TODO: Create a component
const SClientCard = styled("div")`
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  border-radius: 0.5rem;
  height: 200px;
  padding: 1rem;
  text-align: center;
  display: grid;
  place-items: center;
  scale: 1;
  transition: scale 0.15s ease-in-out;

  &:not(.new) {
    background: #fff;

    &:hover {
      scale: 1.05;
    }
  }

  h3 {
    font-size: 16px;
    margin: 0;
  }
`;

export const loader = withAuthentication(async ({ args, prisma, user_id }) => {
  const clients = await prisma.client.findMany({
    where: {
      user_id,
    },
  });
  return json(clients);
});

export default function DashboardClientsIndexPage() {
  const clients = useLoaderData<typeof loader>();

  return (
    <SClientCards>
      {clients.map((client) => (
        <li key={client.id}>
          <Link to={`/clients/${client.slug}`}>
            <SClientCard>
              <h3>{client.name}</h3>
            </SClientCard>
          </Link>
        </li>
      ))}
      <li>
        <Link to={`/clients/new`}>
          <SClientCard className="new">
            <h3>Create a new client</h3>
          </SClientCard>
        </Link>
      </li>
    </SClientCards>
  );

  if (clients.length === 0) {
    return <div>No clients... TBD Add a client</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>State</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => (
          <tr key={client.slug}>
            <td>{client.name}</td>
            <td>{client.address_line_1}</td>
            <td>{client.state}</td>
            <td>
              <Link to={`/clients/${client.slug}`}>Details</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
