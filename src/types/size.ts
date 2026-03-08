/**
 * Size levels for components
 */
export type Size = "x-small" | "small" | "default" | "large" | "x-large";

/**
 * Size props for components that support sizing
 */
export interface SizeProps {
  /**
   * Component size
   * @default 'default'
   */
  size?: Size;
}
