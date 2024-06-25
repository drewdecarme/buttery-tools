import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import "./root.css";
import "@buttery/components/css";

export const meta: MetaFunction = () => [
  {
    charset: "utf-8",
    title: "Invoicer",
    viewport: "width=device-width,initial-scale=1",
  },
];

export const loader: LoaderFunction = (args) => {
  return rootAuthLoader(args, {
    secretKey: args.context.cloudflare.env.CLERK_SECRET_KEY,
    signInUrl: args.context.cloudflare.env.CLERK_SIGN_IN_URL,
    signUpUrl: args.context.cloudflare.env.CLERK_SIGN_UP_URL,
    afterSignInUrl: args.context.cloudflare.env.CLERK_AFTER_SIGN_IN_URL,
    afterSignUpUrl: args.context.cloudflare.env.CLERK_AFTER_SIGN_UP_URL,
  });
};

// Import ClerkApp
import { ClerkApp } from "@clerk/remix";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  return <Outlet />;
}

export default ClerkApp(App);
