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

export const loader = withAuthentication(async ({ args, prisma }) => {
  const invoices = await prisma.invoice.findMany({
    where: {
      Client: {
        slug: args.params.slug,
      },
    },
  });
  return json(invoices);
});

export default function ClientsIndexPage() {
  const invoices = useLoaderData<typeof loader>();

  return (
    <STable>
      <thead>
        <tr>
          <th>Invoice ID</th>
          <th>Subject</th>
          <th>Created At</th>
          <th>Last Updated</th>
          <th>Due Date</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {match(invoices)
          .with(
            P.when((e) => e.length === 0),
            () => (
              <tr>
                <td colSpan={4}></td>
              </tr>
            )
          )
          .otherwise((invoices) =>
            invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.subject}</td>
                <td>{invoice.created_at}</td>
                <td>{invoice.updated_at}</td>
                <td>{invoice.due_date}</td>
                <td>TBD</td>
                <td>
                  <Link to={`/invoice/${invoice.id}`}>View Invoice</Link>
                </td>
              </tr>
            ))
          )}
      </tbody>
    </STable>
  );
}
