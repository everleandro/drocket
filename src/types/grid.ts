export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

export interface ColProps {
  cols?: number | string | "auto";
  xs?: number | string | "auto";
  sm?: number | string | "auto";
  md?: number | string | "auto";
  lg?: number | string | "auto";
  xl?: number | string | "auto";
}

export type GapValue = "none" | "xs" | "sm" | "md" | "lg";

export type RowProps = {
  // modifiers
  dense?: boolean;
  auto?: boolean;
  equal?: boolean;
  noGutters?: boolean;

  // gap
  gap?: GapValue | number | string;
};
