import { ButteryMetaProvider } from "@buttery/meta/react";
import { type ReactNode, StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";

export function ButteryDocsClient({ children }: { children: ReactNode }) {
  return (
    <StrictMode>
      <ButteryMetaProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </ButteryMetaProvider>
    </StrictMode>
  );
}
