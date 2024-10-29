import type { ButteryMeta } from "@buttery/meta";
import { ButteryMetaProvider } from "@buttery/meta/react";
import { type ReactNode, StrictMode } from "react";
import { StaticRouter } from "react-router-dom/server";

export type ButteryDocsContext = {
  route: string;
  Meta: ButteryMeta;
};

export function ButteryDocsServer({
  children,
  ...props
}: ButteryDocsContext & { children: ReactNode }) {
  return (
    <StrictMode>
      <ButteryMetaProvider ButteryMeta={props.Meta}>
        <StaticRouter location={props.route}>{children}</StaticRouter>
      </ButteryMetaProvider>
    </StrictMode>
  );
}
