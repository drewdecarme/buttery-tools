import { exhaustiveMatchGuard } from "@buttery/logger";
import { type FC, type ReactElement, useEffect } from "react";
import type { ButteryMetaDescriptor } from "../buttery-meta.utils.js";
import { useButteryMetaContext } from "./ButteryMeta.context.js";

export type MetaProps = {
  children?: ReactElement[];
  metaJSON?: ButteryMetaDescriptor;
};

// Utility to remove existing elements
// Utility to remove existing elements
const removeExistingElements = (
  selector: string,
  identifier: (el: Element) => boolean
) => {
  const existing = document.querySelectorAll(selector);
  for (const existingNode of existing) {
    if (identifier(existingNode)) {
      existingNode.remove();
    }
  }
};

export const Meta: FC<MetaProps> = ({ children, metaJSON }) => {
  const { ButteryMeta } = useButteryMetaContext();

  useEffect(() => {
    if (!metaJSON) return;

    // Handle title tag
    if (metaJSON.title) {
      removeExistingElements("title", () => true);
      const titleTag = document.createElement("title");
      titleTag.textContent = metaJSON.title;
      document.head.appendChild(titleTag);
    }

    // Handle meta and link tags
    if (metaJSON.meta) {
      for (const metaItem of metaJSON.meta) {
        switch (metaItem.type) {
          case "name": {
            removeExistingElements(
              "meta[name]",
              (el) => el.getAttribute("name") === metaItem.name
            );
            const metaName = document.createElement("meta");
            metaName.name = metaItem.name;
            metaName.content = metaItem.content;
            document.head.appendChild(metaName);
            break;
          }

          case "property": {
            removeExistingElements(
              "meta[property]",
              (el) => el.getAttribute("property") === metaItem.property
            );
            const metaProperty = document.createElement("meta");
            metaProperty.setAttribute("property", metaItem.property);
            metaProperty.content = metaItem.content;
            document.head.appendChild(metaProperty);
            break;
          }

          case "script:ld+json": {
            removeExistingElements(
              'script[type="application/ld+json"]',
              () => true
            );
            const scriptTag = document.createElement("script");
            scriptTag.type = "application/ld+json";
            scriptTag.textContent = JSON.stringify(metaItem.json);
            document.head.appendChild(scriptTag);
            break;
          }

          case "link": {
            removeExistingElements("link", (el) =>
              Object.keys(metaItem.keyValues).every(
                (key) => el.getAttribute(key) === metaItem.keyValues[key]
              )
            );
            const linkTag = document.createElement("link");
            Object.entries(metaItem.keyValues).forEach(([key, value]) =>
              linkTag.setAttribute(key, value)
            );
            document.head.appendChild(linkTag);
            break;
          }

          default:
            exhaustiveMatchGuard(metaItem);
        }
      }
    }
  }, [metaJSON]);

  // On the server, we need to supply the ButteryMeta to take
  // care of any first-time rendering. We use this instance
  // to initially track the children or the metaJSON to
  // render on load. ButteryMeta instance will only be available
  // through the context when the server entry is run. Therefore
  // the below code won't run on the client. The Client, once hydrated
  // will be managed through the `useEffect` above.
  if (!ButteryMeta) return null;

  // If there are child nodes, we're going to process them
  // and store them in the instance that was created on the server
  // and then passed down to the ButterMetaProvider.
  if (children) {
    ButteryMeta.setNodes(children);
  }

  // If there is unstructured JSON, we're going to store
  // it in the instance that was created on the server
  // and then passed down to the ButteryMetaProvider
  if (metaJSON) {
    ButteryMeta.setJSON(metaJSON);
  }

  return null;
};
