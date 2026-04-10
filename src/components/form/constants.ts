import type { InjectionKey } from "vue";

import type { FieldStateKey, FieldVariantKey, FormInjection } from "@/types";

export const fieldStateClasses = {
  disabled: "e-field--is-disabled",
  readonly: "e-field--is-readonly",
  hasError: "e-field--has-error",
  hasValue: "e-field--has-value",
  focused: "e-field--is-focused",
  focusWithin: "e-field--is-focus-within",
  labelFloated: "e-field--label-floated",
  retainColor: "e-field--retain-color",
  hovered: "e-field--is-hovered",
} satisfies Record<FieldStateKey, string>;

export const fieldVariantClasses = {
  outlined: "e-field--outlined",
  labelFloating: "e-field--label-floating",
  labelInline: "e-field--label-inline",
  dense: "e-field--dense",
} satisfies Record<FieldVariantKey, string>;

export const FORM_KEY: InjectionKey<FormInjection> = Symbol("EForm");
