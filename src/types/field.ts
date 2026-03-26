import type { ColProps } from "./grid";
import type { IconPath } from "./icon";
import type { CSSProperties } from "vue";

export type FieldValidationResult = true | string;
export type FieldLabelBehavior = "static" | "floating";

export type FieldRule<T = unknown> = (value: T) => FieldValidationResult;

export interface FieldConfiguration {
  labelStyle?: Record<string, string>;
  color?: string;
  retainColor?: boolean;
  dense?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  outlined?: boolean;
  labelBehavior?: FieldLabelBehavior;
}

export interface FieldBaseProps<TValue = unknown> extends ColProps {
  retainColor?: boolean;
  disabled?: boolean;
  dense?: boolean;
  readonly?: boolean;
  labelBehavior?: FieldLabelBehavior;
  prependIcon?: Array<IconPath> | IconPath | string;
  appendIcon?: Array<IconPath> | IconPath | string;
  labelInline?: boolean;
  detail?: string;
  outlined?: boolean;
  label?: string | number;
  color?: string;
  detailErrors?: Array<string>;
  detailsOnMessageOnly?: boolean;
  inputAlign?: CSSProperties['textAlign'];
  labelMinWidth?: string | number;
  rules?: Array<FieldRule<TValue>>;
}

export interface UseFieldProps<TValue = unknown>
  extends FieldBaseProps<TValue> {
  clearable?: boolean;
  modelValue?: TValue;
}

export interface EField {
  setConfiguration: (value: FieldConfiguration) => void;
  setTableClasses?: (value: Array<string>) => void;
  uid: number;
  dirty: boolean;
  hasError: boolean;
  focus?: () => void;
  validate: () => boolean;
  reset: () => void;
  resetValidation?: () => void;
  cols?: ColProps["cols"];
  xs?: ColProps["xs"];
  sm?: ColProps["sm"];
  md?: ColProps["md"];
  lg?: ColProps["lg"];
  xl?: ColProps["xl"];
}

export type FieldClassKey =
  | "disabled"
  | "readonly"
  | "hasError"
  | "hasValue"
  | "outlined"
  | "focused"
  | "labelFloating"
  | "labelFloated"
  | "retainColor"
  | "labelInline"
  | "hovered"
  | "dense";