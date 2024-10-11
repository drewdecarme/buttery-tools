import type { FC, ReactElement } from "react";
import { useButteryMetaContext } from "./ButteryMeta.context";

export type MetaProps = {
  children?: ReactElement[];
  metaJSON?: Record<string, unknown>;
};

export const Meta: FC<MetaProps> = ({ children, metaJSON }) => {
  const { ButteryMeta } = useButteryMetaContext();

  // If the server supplied ButteryMeta instance isn't supplied,
  // we're just going to return nothing and do nothing.
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
