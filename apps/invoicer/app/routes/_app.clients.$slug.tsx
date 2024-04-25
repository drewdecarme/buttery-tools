import { json } from "@remix-run/cloudflare";
import { withAuthentication } from "../utils/clerk";
import { Link, useLoaderData } from "@remix-run/react";
import { styled } from "@linaria/react";

const SDiv = styled("div")`
  display: grid;
  grid-template-rows: auto 1fr;
`;

export const loader = withAuthentication(async ({ args, prisma, user_id }) => {
  const client = await prisma.client.findUnique({
    where: {
      slug: args.params.slug,
    },
  });
  if (typeof client === null) {
    throw new Response("Not Found", { status: 404 });
  }
  return json(client);
});

export const handle = {
  breadcrumb: (match) => {
    const data = match.data;
    return <Link to={`/clients/${data.slug}`}>{data.name}</Link>;
  },
};

export default function ClientPage() {
  const client = useLoaderData<typeof loader>();

  return (
    <SDiv>
      <div>
        <h1>{client?.name}</h1>
      </div>
      <div>
        <pre>{JSON.stringify(client, null, 2)}</pre>
      </div>
    </SDiv>
  );
}
