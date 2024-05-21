import { json } from "@remix-run/cloudflare";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export function loader(args: LoaderFunctionArgs) {
  console.log(args.params["*"]);
  return json({ message: "hello there" });
}

export const meta: MetaFunction = () => {
  return [
    {
      title: "test"
    }
  ];
};

export default function () {
  const data = useLoaderData<typeof loader>();
  return <div>{data.message}</div>;
}
