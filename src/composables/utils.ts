export const getBooleanClasses = <
  T extends Record<string, unknown>,
  K extends Extract<keyof T, string>
>(
  source: T,
  keys: readonly K[],
  block: string
): string[] => {
  const classes: string[] = [];

  keys.forEach((key) => {
    if (source[key]) {
      classes.push(`${block}--${key}`);
    }
  });

  return classes;
};

export const normalizeDimension = (
  value?: string | number
): string | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "number") return `${value}px`;
  if (/^\d+(\.\d+)?$/.test(value)) return `${value}px`;
  return value;
};

export function useUtils() {
  const isObject = (arg: any): boolean => {
    return typeof arg === "object" && !Array.isArray(arg) && arg !== null;
  };

  return {
    isObject,
  };
}
