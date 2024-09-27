// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const exhaustiveMatchGuard = (_: never): never => {
  throw new Error("Forgot to include an option in the switch statement");
};
