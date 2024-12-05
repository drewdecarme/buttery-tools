import { z } from "zod";

export const butteryCommandsConfigSchema = z.object({
  /**
   * The name of the CLI that the buttery commands will build. This
   * is also the name of the execution string that will trigger the
   * binary
   */
  name: z.string(),
  /**
   * The description of the CLI that the buttery commands will build
   * into the CLI program
   */
  description: z.string(),
  /**
   * The version of the CLI that buttery commands will build into
   * the CLI program
   */
  version: z.string().optional(),
  /**
   * The name of the commands directory relative to the .buttery/
   * directory
   * @default ./commands
   * @example <root>/.buttery/commands
   */
  commandsDir: z.preprocess(
    (value) => value || "/commands",
    z.string().optional()
  ),
});

export type ButteryCommandsConfig = z.infer<typeof butteryCommandsConfigSchema>;
