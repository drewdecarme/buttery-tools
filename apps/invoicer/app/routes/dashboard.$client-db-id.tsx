import { UserButton } from "@clerk/remix";
import { withAuthentication } from "../utils/clerk";
import { styled } from "@linaria/react";
import {
  Link,
  Outlet,
  useLoaderData,
  json,
  useNavigate,
} from "@remix-run/react";

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

export const loader = withAuthentication(async ({ args, prisma, user_id }) => {
  const client = await prisma.client.findUnique({
    where: {
      id: Number(args.params["client-db-id"]),
    },
  });
  if (!client) throw new Error("Cannot find client");
  return json(client);
});

export default function DashboardClientOverview() {
  const client = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  return (
    <div>
      {client.name};<pre>{JSON.stringify(client, null, 2)}</pre>
    </div>
  );
}
