import type { ButteryConfigDocs } from "@buttery/config";

declare module "virtual:data" {
  export const header: ButteryConfigDocs["header"];
}
