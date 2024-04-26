import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import { withAuthentication } from "../utils/clerk";
import { styled } from "@linaria/react";
import { z } from "zod";
import { getDB, withFormData } from "../utils/forms";
import { getAuth } from "@clerk/remix/ssr.server";
import { getPrismaClient } from "../utils/prisma";
import { Invoice } from "@prisma/client";
import { SerializeFrom } from "@remix-run/cloudflare";

const SLayout = styled("div")`
  display: grid;
  height: 100%;
  grid-template-columns: 1fr 60%;
  grid-template-rows: 1fr minmax(80px, max-content);
  padding-bottom: 2rem;
  column-gap: 2rem;
  grid-template-areas:
    "details preview"
    "footer preview";
`;

const SLayoutDetails = styled("div")`
  grid-area: details;
`;

const SLayoutPreview = styled("article")`
  grid-area: preview;
  background: rgb(235, 237, 241);
  border-radius: 8px;
  padding: 2rem;
  display: grid;
  grid-template-rows: auto 1fr;

  .header {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 0.5rem;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #e2e2e2;

    h1 {
      margin: 0;
    }
  }
`;

const SLayoutPreviewPDF = styled("div")`
  background: white;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
`;

const SLayoutFooter = styled("div")`
  grid-area: footer;
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
`;

export const loader = withAuthentication(async ({ args, prisma, user_id }) => {
  const id = Number(args.params["id"]);

  const clients = await prisma.client.findMany({
    where: {
      user_id,
    },
  });

  if (!id) {
    return json({ invoice: null, clients });
  }

  const invoice = await prisma.invoice.findUnique({
    where: {
      id,
    },
  });
  return json({ invoice, clients });
});

export const handle = {
  breadcrumb: ({ data }: { data: SerializeFrom<typeof loader> }) => {
    return (
      <span>{data.invoice ? `INVOICE ${data.invoice.id}` : "New Invoice"}</span>
    );
  },
};

const InvoiceFormSchema = z.object({
  client_id: z.number({
    coerce: true,
    message:
      "You must select a client in order to save a new version of an invoice.",
  }),
});

export const action = withFormData({
  schema: InvoiceFormSchema,
  action: async ({ args, formData }) => {
    const prisma = await getPrismaClient(args);

    const invoice_id = Number(args.params.id);
    let invoice: Invoice;

    if (!invoice_id) {
      invoice = await prisma.invoice.create({
        data: formData,
      });
    } else {
      invoice = await prisma.invoice.update({
        where: {
          id: invoice_id,
        },
        data: formData,
      });
    }

    return redirect(`/invoice/${invoice.id}`);
  },
});

export default function CreateClientInvoicePage() {
  const { clients, invoice } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <SLayout>
      <SLayoutDetails>
        <Form id="invoice-editor" method="post">
          <section>
            <h1>Invoice Details</h1>
            <label>
              <div>Client</div>
              <select defaultValue={invoice?.client_id} name="client_id">
                <option value={""} disabled>
                  Select a client
                </option>
                {clients.map((client) => (
                  <option key={client.slug} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              {actionData?.errors?.client_id.message}
            </label>
          </section>
          <section>
            <h1>Expenses</h1>
          </section>
        </Form>
      </SLayoutDetails>
      <SLayoutFooter>
        <div>Last Saved: {invoice?.updated_at ?? "Not saved"}</div>
        <div>
          <button type="submit" form="invoice-editor">
            Save
          </button>
        </div>
      </SLayoutFooter>
      <SLayoutPreview>
        <div className="header">
          <h1>Preview</h1>
        </div>
        <SLayoutPreviewPDF>pdf here</SLayoutPreviewPDF>
      </SLayoutPreview>
    </SLayout>
  );
}
