/**
 * A inline representation of try/catch that returns the result and error as a discriminated union to
 * handle the error in the continuing closure instead
 * of in a nested try/catch closure. Handling errors becomes as easy as checking to see if the `res.isError`
 * is a truthy value which then can be handled by throwing an error. Once that is checked, any reference to the
 * data will be typed correctly to the response of the function that as passed in.
 *
 * The arguments of the function are curried to avoid inline-ing the entire execution of the function. The function
 * execution is handled internally to the `inlineTryCatch` and then returned in a manner that can be worked with.
 * It's up to the context that this is used to check and handle the error.
 *
 * This is an async function that supports both synchronous and async functions to ensure maximum portability.
 *
 * This method provides a more explicit, Go-like approach to handling errors, avoiding traditional try-catch
 * structures and supporting clearer error handling patterns, especially in asynchronous JavaScript code.
 *
 * @example
 * const result = await inlineTryCatch(doStuffFn)(doStuffFnParams);
 * if (result.hasError) {
 *  `throw LOG.fatal(result.error);
 * }
 */
export function inlineTryCatch<T>(
  fn: (
    ...args: // biome-ignore lint/suspicious/noExplicitAny: We're going to let TS infer the args by casting it to any
    any[]
  ) => Promise<T>
) {
  return async (
    // biome-ignore lint/suspicious/noExplicitAny: We're going to let TS infer the args by casting it to any
    ...args: any[]
  ): Promise<
    | { hasError: false; data: T; error: undefined }
    | { hasError: true; data: undefined; error: Error }
  > => {
    try {
      const result = fn(...args);
      const data = result instanceof Promise ? await result : result;
      return { data, hasError: false, error: undefined };
    } catch (error) {
      return {
        data: undefined,
        hasError: true,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  };
}
