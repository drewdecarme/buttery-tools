import React, { type ReactElement } from "react";
import { type FC, useContext } from "react";
import type { ButteryMeta } from "../ButteryMeta";

type ButteryMetaContextType = {
  ButteryMeta?: ButteryMeta;
};
const ButteryMetaContext = React.createContext<ButteryMetaContextType | null>(
  null
);
export type ButteryMetaProviderProps = {
  children: ReactElement;
  ButteryMeta?: ButteryMeta;
};
export const ButteryMetaProvider: FC<ButteryMetaProviderProps> = ({
  ButteryMeta,
  children,
}) => {
  return (
    <ButteryMetaContext.Provider value={{ ButteryMeta }}>
      {children}
    </ButteryMetaContext.Provider>
  );
};

export const useButteryMetaContext = (): ButteryMetaContextType => {
  const context = useContext(ButteryMetaContext);
  if (!context) {
    throw new Error(
      "'useButteryMetaContext()' must be used within a <ButteryMetaProvider /> component"
    );
  }
  return context;
};
