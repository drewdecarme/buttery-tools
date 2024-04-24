import {
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { getAuth } from "@clerk/remix/ssr.server";
import { getPrismaClient } from "../prisma";

export const withAuthentication =
  (loader: LoaderFunction) => async (args: LoaderFunctionArgs) => {
    try {
      const { userId } = await getAuth(args);
      if (!userId) {
        return redirect(args.context.cloudflare.env.CLERK_SIGN_IN_URL);
      }
      const prisma = await getPrismaClient(args);

      console.log("Saving user", userId);

      await prisma.user.upsert({
        create: {
          id: userId,
        },
        update: {
          id: userId,
        },
        where: {
          id: userId,
        },
      });

      return loader(args);
    } catch (error) {
      throw new Error(`Authentication Error: ${error}`);
    }
  };
