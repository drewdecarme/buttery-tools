import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "Buttery Playground" },
    { name: "description", content: "Let's play!" },
  ];
};

export default function Index() {
  return <div>Hello, Buttery playground!</div>;
}
