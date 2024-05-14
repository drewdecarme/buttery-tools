export const exhaustiveMatchGuard = (_: never): never => {
  throw new Error("Forgot to include an option in the switch statement");
};
