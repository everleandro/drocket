/**
 * Elevation levels for components
 * Maps to --e-elevation-* CSS variables
 */
export type ElevationLevel = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Elevation props for components that support elevation
 */
export interface ElevationProps {
  /**
   * Shadow/elevation level
   * @default undefined
   */
  elevation?: ElevationLevel;
}
