import { dev } from "@buttery/commands/dev";
try {
  await dev();
} catch (error) {
  console.error(error);
}
