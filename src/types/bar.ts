export type BarClassKeys = "dense" | "fixed" | "clipped" | "depressed" | "app" | "absolute";

export interface BarProps {
  dense?: boolean;
  absolute?: boolean;
  app?: boolean;
  outlined?: boolean;
  height?: string | number;
  fixed?: boolean;
  depressed?: boolean;
  color?: string;
  clipped?: boolean;
}
