import { json } from "@remix-run/cloudflare";
import { withAuthentication } from "../utils/clerk";
import {
  Link,
  Outlet,
  useLoaderData,
  useMatch,
  useMatches,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { styled } from "@linaria/react";
import { P, match } from "ts-pattern";
import { UtilityBar } from "../components/display";

export const loader = withAuthentication(async ({ args, prisma, user_id }) => {
  const invoices = await prisma.invoice.findMany({
    where: {
      Client: {
        slug: args.params.slug,
      },
    },
  });
  return json(invoices);
});

const SEmpty = styled("div")`
  height: 200px;
  width: 100%;
  display: grid;
  place-items: center;
`;

export default function ClientsIndexPage() {
  const invoices = useLoaderData<typeof loader>();
  const { slug } = useParams();
  const {} = useMatches();

  return (
    <>
      <UtilityBar>
        <div>All Invoices</div>
        <div>
          <Link to={`/invoice/create?client_slug=${slug}`}>
            Create a new invoice
          </Link>
        </div>
      </UtilityBar>
      <Outlet />
    </>
  );
}
