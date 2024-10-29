import { ButteryLogger } from "@buttery/logs";
import type { ReactElement } from "react";
import ReactDOMServer from "react-dom/server";
import {
  type ButteryMetaDescriptor,
  ButteryMetaSchema,
} from "./buttery-meta.utils.js";
import { exhaustiveMatchGuard } from "./exhaustive-match-guard.js";

export class ButteryMeta {
  private headNodes: ReactElement[] = [];
  private headJSON: Record<string, unknown> = {};
  private LOG: ButteryLogger;

  constructor() {
    this.LOG = new ButteryLogger({
      id: "buttery-meta",
      prefix: "buttery:meta",
      prefixBgColor: "#f2e359",
      logLevel: "debug",
    });
  }

  setNodes(nodes: ReactElement | ReactElement[]) {
    this.LOG.debug("Setting nodes...");
    const nodeArr = Array.isArray(nodes) ? nodes : [nodes];
    const nodeArrSansFalsyValues = nodeArr.filter(Boolean);
    this.headNodes = nodeArrSansFalsyValues;
    this.LOG.debug("Setting nodes... done.");
  }

  setJSON(json: Record<string, unknown>) {
    this.LOG.debug("Setting JSON...");
    this.headJSON = json;
    this.LOG.debug("Setting JSON... done.");
  }

  private parseJson(json: Record<string, unknown>): ButteryMetaDescriptor {
    this.LOG.debug("Parsing JSON...");
    const result = ButteryMetaSchema.safeParse(json);
    if (!result.success) {
      this.LOG.error(
        "Error when trying to parse JSON meta data... Cannot convert metaJson to meta or link nodes."
      );
      this.LOG.error(result.error.toString());
      return {};
    }
    this.LOG.debug("Parsing JSON... done.");
    return result.data;
  }

  private convertJsonIntoNodes(parsedJson: ButteryMetaDescriptor): string {
    this.LOG.debug("Converting JSON to map to node strings...");
    let nodeString = (parsedJson.meta ?? []).reduce<string>((accum, meta) => {
      switch (meta.type) {
        case "name":
          return accum.concat(
            `<meta name="${meta.name}"  content="${meta.content}"></meta>`
          );

        case "property":
          return accum.concat(
            `<meta property="${meta.property}" content="${meta.content}"></meta>`
          );

        case "link": {
          const keyValueString = Object.entries(meta.keyValues).reduce<string>(
            (accum, [key, value]) => accum.concat(`${key}="${value}"`),
            ""
          );
          return accum.concat(`<link ${keyValueString}></link>`);
        }

        case "script:ld+json":
          return accum.concat(
            `<script type="application/ld+json">${JSON.stringify(
              meta.json
            )}</script>`
          );

        default:
          this.LOG.error(`Unable to parse "${meta}"`);
          return exhaustiveMatchGuard(meta);
      }
    }, "");

    if (parsedJson.title) {
      nodeString = nodeString.concat(`<title>${parsedJson.title}</title>`);
    }
    this.LOG.debug("Converting JSON to map to node strings... done.");
    return nodeString;
  }

  /**
   * This method will evaluate store JSON or Elements, parse them
   * and then convert them into string representations of meta nodes
   * to then be placed into the <head /> element of the DOM.
   *
   * This method should be used when attempting to SSR the
   * meta tags that are received somewhere in the app.
   */
  renderNodesToString() {
    let nodeString = "";

    // Parse the JSON into node strings if it exists
    if (Object.values(this.headJSON).length !== 0) {
      this.LOG.debug(
        "Detected meta in JSON format. Parsing into node strings..."
      );
      const parsedJson = this.parseJson(this.headJSON);
      const jsonNodeString = this.convertJsonIntoNodes(parsedJson);
      nodeString = jsonNodeString;
      this.LOG.debug(
        "Detected meta in 'JSON' format. Parsing into node strings... done"
      );
    }

    // Parse the Elements into node strings if they exist
    if (this.headNodes.length !== 0) {
      this.LOG.debug(
        "Detected meta in 'Element' format. Parsing into node strings..."
      );
      nodeString = this.headNodes.reduce(
        (accum, node) => accum.concat(ReactDOMServer.renderToString(node)),
        nodeString
      );
      this.LOG.debug(
        "Detected meta in 'Element' format. Parsing into node strings... done"
      );
    }

    if (!nodeString) return "";

    this.LOG.debug("Rendering meta...");

    // TODO: Dedeup

    this.LOG.debug(`Result: ${nodeString}`);
    this.LOG.debug("Rendering... complete.");
    return nodeString;
  }
}
