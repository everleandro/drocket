import type { FieldBaseProps } from "./field";
import type { IconPath } from "./icon";

export type TimePickerValue = Date | string;

export interface TimePickerProps extends FieldBaseProps<TimePickerValue> {
  modelValue: TimePickerValue;
  hoursStep?: number;
  minutesStep?: number;
  hourReadonly?: boolean;
  minuteReadonly?: boolean;
  /** @deprecated Use minuteReadonly instead. */
  minReadonly?: boolean;
  arrowDown?: string | Array<IconPath> | IconPath;
}

export interface TimePickerEmits {
  (e: "update:modelValue", value: TimePickerValue): void;
  (e: "focus", value: FocusEvent): void;
  (e: "blur", value: FocusEvent): void;
}