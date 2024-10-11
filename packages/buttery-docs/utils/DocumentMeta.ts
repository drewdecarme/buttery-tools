import { ButteryLogger } from "@buttery/logger";
import type { ReactElement } from "react";
import ReactDOMServer from "react-dom/server";

export class DocumentMeta {
  private headNodes: ReactElement[] = [];
  private LOG: ButteryLogger;

  constructor() {
    this.LOG = new ButteryLogger({
      id: "buttery-meta",
      prefix: "buttery:meta",
      prefixBgColor: "#f2e359",
      logLevel: "debug",
    });
  }

  getNodes(nodes: ReactElement | ReactElement[]) {
    const nodeArr = Array.isArray(nodes) ? nodes : [nodes];
    const nodeArrSansFalsyValues = nodeArr.filter(Boolean);
    this.headNodes = nodeArrSansFalsyValues;
  }

  addNode(node: ReactElement) {
    this.headNodes.push(node);
  }

  setNodes(nodes: ReactElement | ReactElement[]) {
    this.LOG.debug("Setting nodes...");
    const nodeArr = Array.isArray(nodes) ? nodes : [nodes];
    const nodeArrSansFalsyValues = nodeArr.filter(Boolean);
    this.headNodes = nodeArrSansFalsyValues;
    this.LOG.debug("Setting nodes... done.");
  }

  renderNodes() {
    this.LOG.debug("Fetching nodes...");
    const nodeString = ReactDOMServer.renderToString(this.headNodes);
    this.LOG.debug(nodeString);
    return nodeString;
  }
}
