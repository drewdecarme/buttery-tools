import { ButteryLogger } from "@buttery/logger";
import type { ReactElement } from "react";
import ReactDOMServer from "react-dom/server";
import {
  type ButteryMetaDescriptor,
  ButteryMetaSchema,
} from "./buttery-meta.utils";

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
    this.LOG.debug("Parsing metaJSON...");
    const result = ButteryMetaSchema.safeParse(json);
    if (!result.success) {
      this.LOG.error(
        "Error when trying to parse JSON meta data... Cannot convert metaJson to meta or link nodes."
      );
      this.LOG.error(result.error.toString());
      return {};
    }
    this.LOG.debug("Parsing metaJSON... done.");
    return result.data;
  }

  private convertJsonIntoNodes(parsedJson: ButteryMetaDescriptor): string {
    this.LOG.debug("Parsing JSON to map to node strings...");
    const nodeString = Object.entries(parsedJson).reduce<string>(
      (accum, [nodeKey, nodeValue]) => {
        console.log({ nodeKey, nodeValue });
        if (nodeKey === "title") {
          return accum.concat(`<title>${nodeValue}</title>`);
        }
        return accum;
      },
      ""
    );
    this.LOG.debug("Parsing JSON to map to node strings... done.");
    return nodeString;
  }

  renderNodesToString() {
    this.LOG.debug("Attempting to render nodes...");

    let nodeString = "";

    if (this.headJSON) {
      console.log({ nodeString });
      const parsedJson = this.parseJson(this.headJSON);
      const jsonNodeString = this.convertJsonIntoNodes(parsedJson);
      nodeString.concat(jsonNodeString);
    }

    nodeString = this.headNodes.reduce(
      (accum, node) => accum.concat(ReactDOMServer.renderToString(node)),
      nodeString
    );

    // TODO: Dedeup

    this.LOG.debug("Attempting to render nodes...");
    this.LOG.debug(nodeString);
    return nodeString;
  }
}
