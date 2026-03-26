import type { FieldBaseProps } from "./field";

export type SwitchValue = boolean | string | number;

export interface SwitchProps extends FieldBaseProps<SwitchValue> {
  modelValue: SwitchValue;
  loading?: boolean;
  hideOverlay?: boolean;
  trueValue?: SwitchValue;
  falseValue?: SwitchValue;
}

export interface SwitchEmits {
  (e: "update:modelValue", value: SwitchValue): void;
  (e: "focus", value: FocusEvent): void;
  (e: "blur", value: Event): void;
}