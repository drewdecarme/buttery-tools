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

export default function DashboardClientOverview() {
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
