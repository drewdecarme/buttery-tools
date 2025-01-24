import { ButteryLogLevelSchema } from "@buttery/core/utils";
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
export type ButteryTokensBaseOptions = z.infer<typeof optionsSchema>;

export const butteryTokensDevOptionsSchema = optionsSchema;
export type ButteryTokensDevOptions = z.infer<
  typeof butteryTokensDevOptionsSchema
>;

export const butteryTokensBuildOptionsSchema = optionsSchema;
export type ButteryTokensBuildOptions = z.infer<
  typeof butteryTokensBuildOptionsSchema
>;

export const butteryTokensTokenStudioOptionsSchema = optionsSchema;
export type ButteryTokensTokenStudioOptions = z.infer<
  typeof butteryTokensTokenStudioOptionsSchema
>;
