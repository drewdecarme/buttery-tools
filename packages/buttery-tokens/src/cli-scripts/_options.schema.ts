import { ButteryLogLevelSchema } from "@buttery/core/logger";
import { z } from "zod";

const optionsSchema = z.object({
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

export const butteryTokensDevOptionsSchema = optionsSchema.extend({
  /**
   * Launch the GUI to see and make your changes to your tokens live
   * or run through the wizard to configure them again
   * @default false
   */
  interactive: z.boolean().default(false),
});

export const butteryTokensBuildOptionsSchema = optionsSchema;
