export type DrawerClassKeys =
  | "disabled"
  | "right"
  | "modelValue"
  | "fixed"
  | "floating";

export interface DrawerProps {
  autoFocus?: boolean;
  modelValue?: boolean;
  floating?: boolean;
  absolute?: boolean;
  disabled?: boolean;
  fixed?: boolean;
  devMode?: boolean;
  nav?: boolean;
  right?: boolean;
  restoreFocus?: boolean;
  widthUnit?: string;
  width?: string | number;
}