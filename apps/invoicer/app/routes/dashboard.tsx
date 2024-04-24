import { UserButton } from "@clerk/remix";
import { withAuthentication } from "../utils/clerk";

export const loader = withAuthentication(async () => {
  return {};
});

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>You are signed in!</p>
      <UserButton />
    </div>
  );
}
