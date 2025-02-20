import { z } from "zod";

export const ButteryLogLevelSchema = z
  .union(
    [
      z.literal("trace"),
      z.literal("debug"),
      z.literal("info"),
      z.literal("warn"),
      z.literal("error"),
      z.literal("fatal"),
    ],
    {
      description: "The level of detail the logs should be displayed at",
    }
  )
  .default("info");
