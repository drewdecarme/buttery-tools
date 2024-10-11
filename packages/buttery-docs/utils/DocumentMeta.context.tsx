import React, { type ReactElement } from "react";
import { type FC, useContext } from "react";
import type { DocumentMeta } from "./DocumentMeta";

type DocumentMetaContextType = {
  Meta?: DocumentMeta;
};
const DocumentMetaContext = React.createContext<DocumentMetaContextType | null>(
  null
);
export type DocumentMetaProviderProps = {
  children: ReactElement;
  Meta?: DocumentMeta;
};
export const DocumentMetaProvider: FC<DocumentMetaProviderProps> = ({
  Meta,
  children,
}) => {
  return (
    <DocumentMetaContext.Provider value={{ Meta }}>
      {children}
    </DocumentMetaContext.Provider>
  );
};

export const useDocumentMetaContext = (): DocumentMetaContextType => {
  const context = useContext(DocumentMetaContext);
  if (!context) {
    throw new Error(
      "'useDocumentMetaContext()' must be used within a <DocumentMetaProvider /> component"
    );
  }
  return context;
};

export const Meta: FC<{ children: ReactElement }> = ({ children }) => {
  const { Meta } = useDocumentMetaContext();

  if (!Meta) return null;

  Meta.setNodes(children);

  return null;
};
