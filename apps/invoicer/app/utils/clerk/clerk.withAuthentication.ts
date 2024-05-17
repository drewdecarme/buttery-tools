import { LoaderFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { getAuth } from "@clerk/remix/ssr.server";
import { getPrismaClient } from "../prisma";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

// Define the LoaderFunction return type
type LoaderFunctionReturnType<T> = ReturnType<typeof json<T>>;

// Define the LoaderFunction type
type LoaderFunction<T> = (params: {
  args: LoaderFunctionArgs;
  prisma: PrismaClient<
    {
      adapter: PrismaD1;
    },
    never,
    DefaultArgs
  >;
  user_id: string;
}) => Promise<LoaderFunctionReturnType<T>>;

export const withAuthentication =
  <T>(loader: LoaderFunction<T>) =>
  async (args: LoaderFunctionArgs) => {
    try {
      const { userId } = await getAuth(args);
      if (!userId) {
        return redirect(args.context.cloudflare.env.CLERK_SIGN_IN_URL);
      }
      const prisma = await getPrismaClient(args);

      console.log("Updating user", userId);
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

      return loader({ args, prisma, user_id: userId });
    } catch (error) {
      throw new Error(`Authentication Error: ${error}`);
    }
  };
