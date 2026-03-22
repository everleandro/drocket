import type { InjectionKey } from "vue";

import type { FieldClassKey, FormInjection } from "@/types";

export const fieldClasses = {
  disabled: "e-field--is-disabled",
  readonly: "e-field--is-readonly",
  hasError: "e-field--has-error",
  hasValue: "e-field--has-value",
  outlined: "e-field--outlined",
  focused: "e-field--is-focused",
  labelFloating: "e-field--label-floating",
  labelFloated: "e-field--label-floated",
  retainColor: "e-field--retain-color",
  labelInline: "e-field--label-inline",
  hovered: "e-field--is-hovered",
  dense: "e-field--dense",
} satisfies Record<FieldClassKey, string>;

export const FORM_KEY: InjectionKey<FormInjection> = Symbol("EForm");
