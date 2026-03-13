/**
 * Size levels for components
 */
export type Size = "x-small" | "small" | "default" | "large" | "x-large";

/**
 * Flexible size values for components that support preset and custom sizing.
 */
export type SizeValue = Size | string | number;

/**
 * Size props for components that support sizing
 */
export interface SizeProps<TSize = Size> {
  /**
   * Component size
   * @default 'default'
   */
  size?: TSize;
}
