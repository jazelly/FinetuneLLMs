import { HF_DATASET_LINK_BASE } from "./constants";

export const isHFDatasetLinkValid = (link) => {
  return link.startsWith(HF_DATASET_LINK_BASE);
};

export const getInitials = (name?: string) => {
  if (!name) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomInitials = Array.from({ length: 2 }, () =>
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join("");
    return randomInitials;
  }

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("");
  return initials.slice(0, 2).toUpperCase();
};
