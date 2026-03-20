import { computed } from "vue";
import type { ColProps, Breakpoint } from "@/types";

export function useGridCol(props: ColProps, prefix: string = "e-col") {
  const breakpoints: Breakpoint[] = ["xs", "sm", "md", "lg", "xl"];

  const gridColClass = computed<string[]>(() => {
    const result: string[] = [];

    if (props.cols !== undefined && props.cols !== null) {
      result.push(`${prefix}-${props.cols}`);
    }

    breakpoints.forEach((bp) => {
      const value = props[bp];
      if (value !== undefined && value !== null) {
        result.push(`${prefix}-${bp}-${value}`);
      }
    });

    return result.length ? [prefix, ...result] : [prefix];
  });

  return {
    gridColClass,
  };
}