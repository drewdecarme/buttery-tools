import { SerializeFrom, json } from "@remix-run/cloudflare";
import { withAuthentication } from "../utils/clerk";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { styled } from "@linaria/react";
import { NavTabs } from "../components";
import { Agreement } from "@icon-park/react";
import { Drawer, useDrawer } from "../components/dialog";
import { ClientAdd } from "../features";

const SDiv = styled("div")`
  display: grid;
  grid-template-rows: auto 1fr;
`;

const SHeader = styled("div")`
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;

  h1 {
    margin: 0;
  }
`;

const SLogo = styled("div")`
  height: 48px;
  width: 48px;
  border-radius: 50%;
  border: none;
  background-color: rgb(var(--color-primary));

  &::before {
    content: attr(data-abbrev);
    font-size: 24px;
    font-family: var(--font-family);
    width: 100%;
    display: block;
    line-height: 48px;
    text-align: center;
    color: #fff;
  }

  img {
  }
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
  breadcrumb: ({ data }: { data: SerializeFrom<typeof loader> }) => {
    return <Link to={`/clients/${data.slug}`}>{data.name}</Link>;
  },
};

export default function ClientPage() {
  const client = useLoaderData<typeof loader>();

  const { drawerRef, openDrawer } = useDrawer();

  return (
    <SDiv>
      <SHeader>
        <SLogo data-abbrev={client.name.split("")[0]}></SLogo>
        <h1>{client?.name}</h1>
        <div>
          <button onClick={openDrawer}>edit client</button>
          <ClientAdd ref={drawerRef} />
          <Link
            to={`/invoice/create?client_slug=${client.slug}`}
            title="Create a new invoice"
          >
            <Agreement size={24} />
          </Link>
        </div>
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
