import { json } from "@remix-run/cloudflare";
import { withAuthentication } from "../utils/clerk";
import { Link, useLoaderData } from "@remix-run/react";
import { styled } from "@linaria/react";
import { P, match } from "ts-pattern";

const SDiv = styled("div")`
  display: grid;
  grid-template-rows: auto 1fr;
  background: white;
  padding: 1rem;
  border-radius: 4px;

  h1 {
    margin: 0;
  }
`;

const STable = styled("table")`
  th {
    text-align: left;
  }
`;

export const loader = withAuthentication(async ({ args, prisma, user_id }) => {
  const expenses = await prisma.expense.findMany({
    where: {
      Client: {
        slug: args.params.slug,
      },
    },
  });
  return json(expenses);
});

export default function ClientsIndexPage() {
  const expenses = useLoaderData<typeof loader>();

  return (
    <SDiv>
      <STable>
        <thead>
          <tr>
            <th>Description</th>
            <th>Price</th>
            <th>Date</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {match(expenses)
            .with(
              P.when((e) => e.length === 0),
              () => (
                <tr>
                  <td colSpan={4}>No expenses</td>
                </tr>
              )
            )
            .otherwise((expenses) =>
              expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>{expense.price}</td>
                  <td>TBD</td>
                  <td>{expense.is_invoiced ? "--" : "Invoiced"}</td>
                </tr>
              ))
            )}
        </tbody>
      </STable>
    </SDiv>
  );
}
