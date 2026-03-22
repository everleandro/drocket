import type { ComputedRef } from "vue";

import type { EField, FieldConfiguration } from "./field";

export interface FormInjection {
  bindField: (component: Partial<EField>) => void;
  unbindField: (uid: number) => void;
  updateField: (component: Partial<EField>) => void;
}

export interface EForm {
  bindField: (component: Partial<EField>) => void;
  unbindField: (uid: number) => void;
  validate: () => Promise<boolean>;
  reset: () => void;
  resetValidation: () => void;
  updateField: (component: Partial<EField>) => void;
}

export interface ERadio {
  uid: number;
  modelValue: ERadioType;
  setConfiguration: (value: FieldConfiguration) => void;
}

export interface ERadioGroup {
  bindRadio: (component: Partial<ERadio>) => void;
  unbindRadio: (uid: number) => void;
  changeModelValue: (value: ERadioType) => void;
  handleFocus: (value?: FocusEvent) => void;
  handleBlur: (value?: Event) => void;
  modelValue: ComputedRef<ERadioType>;
}

export type ERadioType = string | number | undefined | null;
