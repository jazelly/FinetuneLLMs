import { HF_DATASET_LINK_BASE } from "./constants";

export const isHFDatasetLinkValid = (link) => {
  return link.startsWith(HF_DATASET_LINK_BASE);
};
