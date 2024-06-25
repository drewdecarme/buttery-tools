import { type PlatformProxy } from "wrangler";

// When using `wrangler.toml` to configure bindings,
// `wrangler types` will generate types for those bindings
// into the global `Env` interface.
// Need this empty interface so that typechecking passes
// even if no `wrangler.toml` exists.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Env {
  CLERK_SECRET_KEY: string;
  CLERK_SIGN_IN_URL: string;
  CLERK_SIGN_UP_URL: string;
  CLERK_AFTER_SIGN_IN_URL: string;
  CLERK_AFTER_SIGN_UP_URL: string;
  DB: D1Database;
}

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}
