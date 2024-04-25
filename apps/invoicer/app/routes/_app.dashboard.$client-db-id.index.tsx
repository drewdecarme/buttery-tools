import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { withAuthentication } from "../utils/clerk";
import {
  useLoaderData,
  json,
  Form,
  useNavigation,
  Link,
} from "@remix-run/react";
import { getAuth } from "@clerk/remix/ssr.server";
import { getPrismaClient } from "../utils/prisma";
import { z } from "zod";

export const loader = withAuthentication(async ({ args, prisma, user_id }) => {
  const client_db_id = Number(args.params["client-db-id"]);
  const getClient = prisma.client.findUnique({
    where: {
      id: client_db_id,
    },
  });
  const getClientExpenses = prisma.expense.findMany({
    where: {
      Client: {
        id: client_db_id,
        user_id,
      },
    },
  });
  const [client, expenses] = await Promise.all([getClient, getClientExpenses]);
  if (!client) throw new Error("Cannot find client");
  return json({ client, expenses });
});

const ExpenseSchema = z.object({
  description: z.string(),
  price: z.number(),
  client_id: z.number(),
});

export const action = async (args: ActionFunctionArgs) => {
  // put this into another curreid function
  const { userId: user_id } = await getAuth(args);
  if (!user_id) throw new Error("Cannot locate user");
  const prisma = await getPrismaClient(args);

  try {
    const formData = await args.request.formData();
    const formDataObj = Object.fromEntries(formData.entries());
    const data = Object.entries(formDataObj).reduce((accum, [key, value]) => {
      if (key === "client-id") return { ...accum, client_id: Number(value) };
      if (key === "price") return { ...accum, [key]: Number(value) };
      return { ...accum, [key]: value };
    }, {});
    const validatedData = ExpenseSchema.parse(data);

    const expense = await prisma.expense.create({
      data: {
        ...validatedData,
        terms_and_conditions: "",
      },
    });
    return expense;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

export default function DashboardClientOverview() {
  const { client, expenses } = useLoaderData<typeof loader>();
  const { state } = useNavigation();

  return (
    <div>
      {client.name};<pre>{JSON.stringify(client, null, 2)}</pre>
      <Form method="post">
        <label>
          <div>Description</div>
          <textarea name="description" />
        </label>
        <label>
          <div>Price</div>
          <input type="number" name="price" />
        </label>
        <input type="hidden" name="client-id" value={client.id} />
        <button type="submit">
          {state === "submitting" ? "Loading..." : "Add expense"}
        </button>
      </Form>
      <Link to={`/dashboard/${client.id}/invoice/create`}>
        Create an invoice
      </Link>
      <table>
        <tr>
          <th>Description</th>
          <th>Price</th>
          <th>Is Invoiced</th>
        </tr>
        {expenses.length === 0 ? (
          <tr>
            <td colSpan={3}>No expenses</td>
          </tr>
        ) : (
          expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.description}</td>
              <td>$ {expense.price}</td>
              <td>$ {expense.is_invoiced}</td>
            </tr>
          ))
        )}
      </table>
    </div>
  );
}
