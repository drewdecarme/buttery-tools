import { json } from "@remix-run/cloudflare";
import { withAuthentication } from "../utils/clerk";
import { Link, useLoaderData } from "@remix-run/react";
import { styled } from "@linaria/react";

const SDiv = styled("div")`
  display: grid;
  grid-template-rows: auto 1fr;
  background: white;
  padding: 1.5rem 1rem;
  border-radius: 1rem;

  h1 {
    margin: 0;
  }
`;

export const loader = withAuthentication(async ({ prisma, user_id }) => {
  const clients = await prisma.client.findMany({
    where: {
      user_id,
    },
  });
  return json(clients);
});

export default function ClientsIndexPage() {
  const clients = useLoaderData<typeof loader>();

  return (
    <div>
      <div>
        <h1>Clients</h1>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.slug}>
              <td>{client.name}</td>
              <td>{client.address_line_1}</td>
              <td>
                <Link to={`/clients/${client.slug}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
