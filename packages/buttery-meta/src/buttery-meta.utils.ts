import z from "zod";

// Base schema for all JSON-LD types
const jsonLdSchemaRecordBase = z.object({
  "@type": z.string(),
});
// Recursively reference the schema record with itself
// to create nested validation for
const jsonLdSchemaRecord: z.ZodTypeAny = z.lazy(() =>
  jsonLdSchemaRecordBase.and(
    z.record(
      z.string(),
      z.union([z.string(), z.number(), z.null(), jsonLdSchemaRecord])
    )
  )
);

const ButteryMetaSchemaJsonLd = z.object({
  type: z.literal("script:ld+json"),
  json: z
    .object({
      "@context": z.string().default("https://schema.org"),
    })
    .and(jsonLdSchemaRecord),
});

const ButteryMetaSchemaName = z.object({
  type: z.literal("name"),
  name: z.string(),
  content: z.string(),
});

const ButteryMetaSchemaProperty = z.object({
  type: z.literal("property"),
  property: z.string(),
  content: z.string(),
});

const ButteryMetaSchemaLink = z.object({
  type: z.literal("link"),
  keyValues: z.record(z.string(), z.string()),
});

export const ButteryMetaSchema = z.object({
  title: z.string().optional(),
  meta: z
    .discriminatedUnion("type", [
      ButteryMetaSchemaName,
      ButteryMetaSchemaProperty,
      ButteryMetaSchemaJsonLd,
      ButteryMetaSchemaLink,
    ])
    .array()
    .optional(),
  headers: z.record(z.string(), z.string()).optional(),
});
export type ButteryMetaDescriptor = z.infer<typeof ButteryMetaSchema>;
