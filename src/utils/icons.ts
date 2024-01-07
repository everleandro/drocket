import { IconPath } from "@/types";

export const iconFactory: Record<string, IconPath> = {
  arrowLeft: {
    d: "M14,7L9,12L14,17V7Z",
  },
  arrowRight: {
    d: "M10,17L15,12L10,7V17Z",
  },
  arrowDown: {
    d: "M7,10L12,15L17,10H7Z",
  },
  clear: {
    d: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
  },
};
export default iconFactory;
