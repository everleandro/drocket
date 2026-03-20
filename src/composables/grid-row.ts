import { computed } from "vue";
import type { RowProps } from "@/types";

const GAP_VALUES = ["none", "xs", "sm", "md", "lg"] as const;

export function useGridRow(props: RowProps, prefix: string = "e-row") {
  const gridRowClass = computed<string[]>(() => {
    const classes: string[] = [prefix];

    // modifiers
    if (props.dense) classes.push(`${prefix}--dense`);
    if (props.auto) classes.push(`${prefix}--auto`);
    if (props.equal) classes.push(`${prefix}--equal`);
    if (props.noGutters) classes.push(`${prefix}--no-gutters`);

    return classes;
  });

  const gridRowStyle = computed<Record<string, string>>(() => {
    const styles: Record<string, string> = {};

    const gap = normalizeGap(props.gap);

    if (gap) {
      styles["--e-grid-gap"] = gap;
    }

    return styles;
  });

  const normalizeGap = (value: RowProps["gap"]): string | null => {
    if (value == null) return null;

    // caso tokens: sm, md, etc.
    if (GAP_VALUES.includes(value as any)) {
      return `var(--e-grid-gap-${value})`;
    }

    // número
    if (typeof value === "number") {
      if (Number.isInteger(value)) {
        return `${value}px`;
      }
      if (process.env.NODE_ENV !== "production") {
        console.warn("e-grid: gap debe ser entero:", value);
      }
      return null;
    }

    // string numérico
    if (/^-?\d+$/.test(value)) {
      return `${parseInt(value, 10)}px`;
    }
    if (process.env.NODE_ENV !== "production") {
      console.warn("e-grid: gap no reconocido:", value);
    }
    return null;
  };

  return {
    gridRowClass,
    gridRowStyle,
  };
}
