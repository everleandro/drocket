export type BarClassKeys = "dense" | "fixed" | "clipped" | "depressed" | "app";

export interface BarProps {
  dense?: boolean;
  absoulute?: boolean;
  app?: boolean;
  outlined?: boolean;
  height?: string | number;
  fixed?: boolean;
  depressed?: boolean;
  color?: string;
  clipped?: boolean;
}
