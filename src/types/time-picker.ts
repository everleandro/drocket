import type { FieldBaseProps } from "./field";
import type { IconPath } from "./icon";

export interface TimePickerProps extends FieldBaseProps<Date | string> {
  modelValue: Date | string;
  hoursStep?: number;
  minutesStep?: number;
  hourReadonly?: boolean;
  minuteReadonly?: boolean;
  minReadonly?: boolean;
  arrowDown?: string | Array<IconPath> | IconPath;
}

export interface TimePickerEmits {
  (e: "update:modelValue", value: string | Date): void;
  (e: "focus", value: Event): void;
  (e: "blur", value: Event): void;
}