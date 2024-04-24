import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";

export const getPrismaClient = async (args: LoaderFunctionArgs) => {
  const adapter = new PrismaD1(args.context.cloudflare.env.DB);
  const prismaClient = new PrismaClient({ adapter });
  return prismaClient;
};
