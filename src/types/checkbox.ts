import type { UseFieldProps } from "./field";

export type CheckboxValue = boolean | string | number;

export interface CheckboxProps extends UseFieldProps<CheckboxValue> {
  modelValue: CheckboxValue;
  showOverlay?: boolean;
  trueValue?: CheckboxValue;
  falseValue?: CheckboxValue;
}

export interface CheckboxEmits {
  (e: "update:modelValue", value: CheckboxValue): void;
  (e: "focus", value: FocusEvent): void;
  (e: "blur", value: Event): void;
}