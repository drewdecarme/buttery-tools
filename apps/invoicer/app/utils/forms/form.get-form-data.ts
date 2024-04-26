import { getAuth } from "@clerk/remix/ssr.server";
import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { ZodIssue, ZodSchema, z } from "zod";
import { getPrismaClient } from "../prisma";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export const getFormData = (args: ActionFunctionArgs, schema: ZodSchema) => {};

// Define the ActionFunction return type
type ActionFunctionReturnType<T> = ReturnType<typeof json<T>>;

// Define the ActionFunction type
type ActionFunction<S extends ZodSchema, T> = (params: {
  args: ActionFunctionArgs;
  formData: z.infer<S>;
}) => Promise<ActionFunctionReturnType<T>>;

/**
 * A higher order function that wraps that wraps the action
 * to abstract out some form data boilerplate. Provided a zod
 * schema, this HOF will grab the formData off of the request,
 * parse and validate it. If the validation fails, a well formed
 * error object will be returned to the component which can
 * be accessed using useActionData. If it is successful, the
 * execution will continue and the parsed and coerced formData
 * will be available on the parameters of the action that was passed
 * into this HOF.
 *
 * @example
    const InvoiceFormSchema = z.object({
        client_id: z.number({
            coerce: true,
            message:
            "You must select a client in order to save a new version of an invoice.",
        }),
    });

    export const action = withFormData({
        schema: InvoiceFormSchema,
        action: async ({ args, formData }) => {
            // logic here
            return json({ data: { key: "some stuff" } });
        },
    });
 */
export const withFormData =
  <S extends ZodSchema, T>({
    schema,
    action,
  }: {
    schema: S;
    action: ActionFunction<typeof schema, T>;
  }) =>
  async (args: ActionFunctionArgs) => {
    try {
      const formData = await args.request.formData();
      const formDataObj = Object.fromEntries(formData.entries());
      const parsedFormData = schema.parse(formDataObj);
      return action({ args, formData: parsedFormData });
    } catch (error) {
      const err = error as z.ZodError;
      const errResponse = err.flatten((issue: ZodIssue) => ({
        message: issue.message,
        errorCode: issue.code,
      }));

      const errors = Object.entries(errResponse.fieldErrors).reduce<{
        [key in keyof z.infer<S>]: { message: string };
      }>((accum, [fieldName, fieldErrors]) => {
        if (!fieldErrors) return accum;
        const messages = fieldErrors.map(({ message }) => message);
        return {
          ...accum,
          [fieldName]: {
            // only return 1 error at a time
            message: messages[0],
          },
        };
      }, {} as { [key in keyof z.infer<S>]: { message: string } });

      return json({ errors });
    }
  };

export const getDB = async (args: ActionFunctionArgs) => {
  try {
    const { userId: user_id } = await getAuth(args);
    if (!user_id) throw new Error();
    const prisma = await getPrismaClient(args);
    return { prisma, user_id };
  } catch (error) {
    console.log(error);
    // throw new Response(error as string, { status: 500 });
  }
};
