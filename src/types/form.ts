import { ComputedRef } from "vue";
export declare interface EField {
  setConfiguration: (value: Record<string, string>) => void;
  uid: number;
  dirty: boolean;
  hasError: any;
  validate: () => void;
  reset: () => void;
}

export interface EForm {
  bindField: (component: Partial<EField>) => void;
  unbindField: (uid: number) => void;
  validate: () => Promise<boolean>;
  reset: () => void;
  updateField: (component: Partial<EField>) => void;
}

export interface ERadio {
  uid: number;
  modelValue: ERadioType;
  setConfiguration: (value: Record<string, string>) => void;
}

export interface ERadioGroup {
  bindRadio: (component: Partial<ERadio>) => void;
  unbindRadio: (uid: number) => void;
  changeModelValue: (value: ERadioType) => void;
  handleFocus: (value?: FocusEvent) => void;
  handleBlur: (value?: Event) => void;
  modelValue: ComputedRef<ERadioType>;
}

export declare type ERadioType = string | number | undefined | null;
export declare type FieldClassKey =
  | "disabled"
  | "readonly"
  | "hasError"
  | "outlined"
  | "focused"
  | "labelInline"
  | "hovered"
  | "dense";
