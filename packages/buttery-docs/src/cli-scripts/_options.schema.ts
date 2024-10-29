import { ButteryLogLevelSchema } from "@buttery/core/logger";
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

export const devSchema = baseOptionsSchema.extend({
  /**
   * Opens the DevServer to the configured hostname and port
   * when it starts
   * @default true
   */
  open: z.boolean().default(true),
  /**
   * Specify the port the host should run on
   */
  host: z.string().default("localhost"),
  /**
   * The port at which the DevServer will run on
   */
  port: z.number().default(4000),
});
export const buildSchema = baseOptionsSchema;
export const formatSchema = baseOptionsSchema;
export const orderSchema = baseOptionsSchema;
