import { UserButton } from "@clerk/remix";
import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  console.log(args.context);
  if (!userId) {
    return redirect(args.context.cloudflare.env.CLERK_SIGN_IN_URL);
  }
  return {};
};

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>You are signed in!</p>
      <UserButton />
    </div>
  );
}
