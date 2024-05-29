import type { FC } from "react";
import { generatedTokens } from "./tokens-generated";

export const ConfigColor: FC = () => {
  return <pre>{JSON.stringify(generatedTokens.config.color, null, 2)}</pre>;
};
