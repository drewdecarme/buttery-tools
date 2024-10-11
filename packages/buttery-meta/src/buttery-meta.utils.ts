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

const ButteryMetaSchemaJsonLd = z.record(
  z.literal("script:ld+json"),
  z
    .object({
      "@context": z.string().default("https://schema.org"),
    })
    .and(jsonLdSchemaRecord)
);

const ButteryMetaSchemaTitle = z.object({ title: z.string() });

const ButteryMetaSchemaNameAndContent = z.object({
  name: z.string(),
  content: z.string(),
});

const ButteryMetaSchemaPropertyAndContent = z.object({
  property: z.string(),
  content: z.string(),
});

const ButteryMetaSchemaMetaAndLink = z
  .object({ tagName: z.union([z.literal("meta"), z.literal("link")]) })
  .and(z.record(z.string(), z.string()));

export const ButteryMetaSchema = z.union([
  ButteryMetaSchemaTitle,
  ButteryMetaSchemaNameAndContent,
  ButteryMetaSchemaPropertyAndContent,
  ButteryMetaSchemaJsonLd,
  ButteryMetaSchemaMetaAndLink,
]);
export type ButteryMetaDescriptor = z.infer<typeof ButteryMetaSchema>;
