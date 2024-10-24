import { dev } from "@buttery/commands/cli/dev";
try {
  await dev();
} catch (error) {
  console.error(error);
}
