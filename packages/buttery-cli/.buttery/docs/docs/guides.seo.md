---
title: SEO & Page Configuration
meta:
  - type: name
    name: description
    content: Configure the SEO of the page such as title and description as well as page layout, appearance, etc...
---

# SEO & Page Configuration

SEO is an important part of the discoverability and searchability for the documentation that you write. In order to promote good SEO practices as well as co-location, all SEO for the page can be defined in the frontmatter of the document that you're writing.

## Frontmatter

Frontmatter is the stuff between the `---` dashes in the top of `.md` or `.mdx` documents. It can be expressed in `JSON` or `YAML` but you'll most likely see it expressed in YAML. Personally I think YAML is the worst, but I use it because I guess I'm a follower and can't help myself.

```md
---
title: This is some frontmatter
---
```

`ButteryDocs` expects the frontmatter to be in a specific format. Continue on...

## SEO

The `meta` tags + tags such as `og` tags and the `title` attribute can all be defined in the frontmatter. **Buttery Docs** requires the frontmatter for the SEO to be in a specific format due to the fact that it uses [`@buttery/meta`](../meta/index.md) to configure and manage the Server Side Tags and tags on the client side after the page has been hydrated.

Below is the type signature for the meta tags:

```ts
type ButteryMetaDescriptor = {
  title?: string | undefined;
  meta?:
    | (
        | {
            type: "name";
            name: string;
            content: string;
          }
        | {
            type: "property";
            content: string;
            property: string;
          }
        | {
            type: "script:ld+json";
            json: {
              "@context": "https://schema.org";
              // ...rest schemas from schema.org
            };
          }
        | {
            type: "link";
            keyValues: Record<string, string>;
          }
      )[]
    | undefined;
};
```

### title

The title of the page as it appears in the tab of the browser

```md
---
title: Peace be da journey!
---
```

Will output

```html
<title>Peace be da journey!</title>
```

### meta

The `frontmatter.meta` has been organized into a discriminated union to make it easier to reason about during the rendering process. You can have as many meta tags as you want as it's an array, however, each of them has a specific key that describes the meta value as well as the keys that then describe that key.

### meta.name

Create any meta tag that has a `name` and a `description`

```md
---
meta:
  - type: name
    name: description
    content: This is a description of the page that will appear in the header
---
```

Will output

```html
<meta
  name="description"
  content="This is a description of the page that will appear in the header"
/>
```

### meta.property

Use this to create `og` property tags for social cards, twitter blocks, etc...

```md
---
meta:
  - type: property
    property: og:title
    content: This looks sick when I share this page
---
```

Will output

```html
<meta property="og:title" content="This looks sick when I share this page" />
```

### meta.script:ld+json

Use this to create any structured content `<script>`s you need for the page.

```md
---
meta:
  - type: "script:ld+json"
    JSON: { "@context": "https://schema.org", ...restJson }
---
```

Will output

```html
<script type="application/ld+json">
  <!-- serialized JSON -->
</script>
```

### meta.link

> Work in progress. Coming soon!

## Page Configurations

Other page / app attributes can be configured from the frontmatter in the document. This ensures that _all_ things that have to do with the customization of the page are contained within the page itself, and not in some configuration file somewhere completely outside the boundaries of how you write your document.

Below is the type signature of the page configuration:

```ts
type ButterDocsDocumentConfig = {
  config?: {
    navBarDisplay?: string;
  };
};
```

### config.navBarDisplay

- Type: `string \| undefined`
- Default: `undefined`
- Fallback: `frontmatter.title`

This value is the string that will be displayed in the SideNavigation bar that lets you jump from link to link.

In the event that this value doesn't exist in the frontmatter, the `navBarDisplay` will fallback to the `frontmatter.title` key.

#### Example: Value exists

The string that will display in the navbar will be `SEO & Page Configuration`

```md
---
config
    navBarDisplay: SEO & Page Configuration
---
```

#### Example: No value BUT title

The string that will display in the navbar will be `SEO`

```md
---
title: SEO
---
```

#### Example: No value OR title

The string that will display in the navbar will be the name of the page route where the dashes are replaced with spaces

So if this page was named `guides.seo-and-page-config` and the below frontmatter existed, the navbar would display `seo and page config`

```md
---
---
```

## Headers

> Work in progress. Coming soon!
