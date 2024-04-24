import {
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { getAuth } from "@clerk/remix/ssr.server";

export const withAuthentication =
  (loader: LoaderFunction) => async (args: LoaderFunctionArgs) => {
    const { userId } = await getAuth(args);
    if (!userId) {
      return redirect(args.context.cloudflare.env.CLERK_SIGN_IN_URL);
    }
    return loader(args);
  };
