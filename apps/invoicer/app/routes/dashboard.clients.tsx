import { json } from "@remix-run/cloudflare";
import { withAuthentication } from "../utils/clerk";
import { useLoaderData } from "@remix-run/react";
import { styled } from "@linaria/react";

const SDiv = styled("div")`
  display: grid;
  grid-template-rows: auto 1fr;
`;

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

  return (
    <SDiv>
      <div>
        <h1>Clients</h1>
      </div>
      <div>
        <pre>{JSON.stringify(clients, null, 2)}</pre>
      </div>
    </SDiv>
  );
}
