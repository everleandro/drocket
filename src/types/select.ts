import type { FieldValidationResult, UseFieldProps } from "./field";
import type { IconPath } from "./icon";

export type SelectPrimitiveValue = string | number | null;
export type SelectItemObject = Record<string, unknown>;
export type SelectItemType = SelectPrimitiveValue | SelectItemObject;
export type SelectModelValue = SelectItemType | Array<SelectItemType>;

export interface SelectProps extends UseFieldProps<SelectModelValue> {
  arrowDown?: string | IconPath | Array<IconPath>;
  menuColor?: string;
  multiple?: boolean;
  returnObject?: boolean;
  loading?: boolean;
  itemCol?: string | number;
  search?: string | number;
  placeholder?: string;
  suffix?: string;
  autocomplete?: boolean;
  chip?: boolean;
  lineWidth?: string | number;
  prefix?: string;
  limit?: string | number;
  chipClosable?: boolean;
  itemText?: string;
  itemValue?: string;
  items: Array<SelectItemType>;
}

export interface SelectEmits {
  (e: "click:clear"): void;
  (e: "focus", value: FocusEvent): void;
  (e: "click:prepend"): void;
  (e: "click:append"): void;
  (e: "blur", value: Event): void;
  (e: "update:modelValue", value: SelectModelValue): void;
  (e: "update:search", value: string | number): void;
}

export type SelectRule<T = SelectModelValue> = (
  value: T,
) => FieldValidationResult;
