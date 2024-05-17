import { Outlet, json, useLoaderData, useNavigate } from "@remix-run/react";
import { useCallback, ChangeEventHandler } from "react";
import { withAuthentication } from "../utils/clerk";

export const loader = withAuthentication(async ({ args, prisma, user_id }) => {
  const clients = await prisma.client.findMany({
    where: {
      user_id,
    },
  });
  return json({ clients, params: args.params });
});

export default function DashboardIndex() {
  const { clients, params } = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  const handleSelect = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    ({ currentTarget: { value } }) => {
      navigate(`/dashboard/${value}`);
    },
    []
  );

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <select onChange={handleSelect} defaultValue={params["client-db-id"]}>
          <option value={undefined} disabled>
            Select a client
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>
      <Outlet />
    </div>
  );
}
