import { ButteryLogLevelSchema } from "@buttery/core/utils";
import { z } from "zod";

const baseOptionsSchema = z.object({
  /**
   * The level of detail the logs should be displayed at
   * @default info
   */
  logLevel: ButteryLogLevelSchema.default("info"),
  /**
   * If the required folder structures don't exist, display
   * prompts to create them / re-align them instead of
   * throwing errors
   * @default true
   */
  prompt: z.boolean().default(true),
});

export const butteryIconsDevOptionsSchema = baseOptionsSchema;
export const butteryIconsBuildOptionsSchema = baseOptionsSchema;
