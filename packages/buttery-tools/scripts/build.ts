import { build } from "@buttery/commands/build";
try {
  await build();
} catch (error) {
  console.error(error);
}
