import { json } from "@remix-run/cloudflare";
import { withAuthentication } from "../utils/clerk";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { styled } from "@linaria/react";
import { NavTabs } from "../components";
import { Agreement } from "@icon-park/react";

const SDiv = styled("div")`
  display: grid;
  grid-template-rows: auto 1fr;
`;

const SHeader = styled("div")`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
`;

export const loader = withAuthentication(async ({ args, prisma, user_id }) => {
  const client = await prisma.client.findUnique({
    where: {
      slug: args.params.slug,
    },
  });
  if (!client) throw new Response("Not Found", { status: 404 });

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
      <SHeader>
        <h1>{client?.name}</h1>
        <Link
          to={`/invoice/create?client_slug=${client.slug}`}
          title="Create a new invoice"
        >
          <Agreement size={24} />
        </Link>
      </SHeader>
      <NavTabs>
        <ul>
          <li>
            <NavLink to={`/clients/${client.slug}`} end>
              Expenses
            </NavLink>
          </li>
          <li>
            <NavLink to={`/clients/${client.slug}/invoice`}>Invoices</NavLink>
          </li>
        </ul>
      </NavTabs>
      <div>
        <Outlet />
      </div>
    </SDiv>
  );
}
