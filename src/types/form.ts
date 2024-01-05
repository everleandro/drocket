import { ComputedRef } from "vue";
export declare interface Field {
  setConfiguration: (value: Record<string, string>) => void;
  uid: number;
  dirty: boolean;
  hasError: any;
  validate: () => void;
  reset: () => void;
}

export interface Form {
  bindField: (component: Partial<Field>) => void;
  unbindField: (uid: number) => void;
  validate: () => Promise<boolean>;
  reset: () => void;
  updateField: (component: Partial<Field>) => void;
}

export interface Radio {
  uid: number;
  modelValue: radioType;
  setConfiguration: (value: Record<string, string>) => void;
}

export interface RadioGroup {
  bindRadio: (component: Partial<Radio>) => void;
  unbindRadio: (uid: number) => void;
  changeModelValue: (value: radioType) => void;
  handleFocus: (value?: FocusEvent) => void;
  handleBlur: (value?: Event) => void;
  modelValue: ComputedRef<radioType>;
}

export declare type radioType = string | number | undefined | null;
export declare type classKey =
  | "disabled"
  | "readonly"
  | "hasError"
  | "outlined"
  | "focused"
  | "labelInline"
  | "hovered"
  | "dense";
