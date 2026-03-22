export const normalizeCssSize = (
  value?: number | string,
): string | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "number") return `${value}px`;
  return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
};