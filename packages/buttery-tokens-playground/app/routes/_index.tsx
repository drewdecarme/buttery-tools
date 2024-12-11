import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <h2>Welcome to Buttery Tokens</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus vel
        beatae ratione doloribus! Animi, molestias molestiae nisi exercitationem
        unde, repudiandae asperiores ab consequatur pariatur ex alias quod,
        laudantium dolores debitis.
      </p>
      <div>
        <Link to="/config">Configure a new token set</Link>
      </div>
      <div>
        <Link to="/config">Edit an existing one (requires sign-in)</Link>
      </div>
    </div>
  );
}
