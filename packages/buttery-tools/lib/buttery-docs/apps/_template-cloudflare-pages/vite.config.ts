import { getButteryDocsDefineConfig } from "../../../../.buttery/commands/docs/docs.defineBaseDocsConfig";

const defineDocsConfig = await getButteryDocsDefineConfig();

// https://vitejs.dev/config/
export default defineDocsConfig(() => ({
  // change the root here since we're looking at this directory
  root: import.meta.dirname
}));
