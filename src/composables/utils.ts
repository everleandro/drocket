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

export function useUtils() {
  const isObject = (arg: any): boolean => {
    return typeof arg === "object" && !Array.isArray(arg) && arg !== null;
  };

  return {
    isObject,
  };
}
