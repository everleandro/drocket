export type DrawerClassKeys =
  | "disabled"
  | "right"
  | "modelValue"
  | "fixed"
  | "floating";

export interface DrawerProps {
  modelValue?: boolean;
  floating?: boolean;
  absolute?: boolean;
  disabled?: boolean;
  fixed?: boolean;
  devMode?: boolean;
  nav?: boolean;
  right?: boolean;
  widthUnit?: string;
  width?: string | number;
}