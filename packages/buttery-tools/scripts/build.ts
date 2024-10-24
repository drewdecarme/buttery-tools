import { build } from "@buttery/commands/cli/build";
try {
  await build();
} catch (error) {
  console.error(error);
}
