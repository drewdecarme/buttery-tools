import { json } from "@remix-run/cloudflare";
import { withAuthentication } from "../utils/clerk";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
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

export const handle = {
  breadcrumb: () => <Link to="/clients">Clients</Link>,
};

export const loader = withAuthentication(async ({ prisma, user_id }) => {
  const clients = await prisma.client.findMany({
    where: {
      user_id,
    },
  });
  return json(clients);
});

export default function DashboardClientsPage() {
  const clients = useLoaderData<typeof loader>();
  console.log(clients);

  return (
    <SDiv>
      <Outlet />
    </SDiv>
  );
}
