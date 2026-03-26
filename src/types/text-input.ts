import type { CSSProperties } from "vue";
import type { FieldBaseProps, FieldValidationResult } from "./field";
import type { IconPath } from "./icon";

export type TextInputValue = string | number | null;
export type TextInputElement = HTMLInputElement | HTMLTextAreaElement;

export type TextInputModelModifiers = Partial<
  Record<"trim" | "number" | "lazy", boolean>
>;

export type TextInputInputMode =
  | "text"
  | "search"
  | "email"
  | "tel"
  | "url"
  | "none"
  | "numeric"
  | "decimal";

export type TextInputEnterKeyHint =
  | "enter"
  | "done"
  | "go"
  | "next"
  | "previous"
  | "search"
  | "send";

export type TextInputValueEventPayload<EventType extends Event = Event> = {
  rawValue: string;
  value: TextInputValue;
  event: EventType;
};

export type TextInputKeyEventPayload = {
  rawValue: string;
  value: TextInputValue;
  event: KeyboardEvent;
};

export interface TextInputBaseProps<TValue = TextInputValue>
  extends FieldBaseProps<TValue> {
  name?: string;
  modelValue?: TValue;
  placeholder?: string;
  autocomplete?: string;
  inputAlign?: CSSProperties["textAlign"];
  inputReadonly?: boolean;
  autofocus?: boolean;
}

export interface UseTextInputProps<TValue = TextInputValue>
  extends TextInputBaseProps<TValue> {
  disabled?: boolean;
  clearable?: boolean;
  iconClear?: Array<IconPath> | IconPath | string;
  limit?: string | number;
  type?: string;
  modelModifiers?: TextInputModelModifiers;
  spellcheck?: boolean;
  autocapitalize?: string;
  enterkeyhint?: TextInputEnterKeyHint;
}

export interface TextInputEmits {
  (e: "click:clear"): void;
  (e: "focus", value: FocusEvent): void;
  (e: "blur", value: Event): void;
  (e: "update:modelValue", value: TextInputValue): void;
  (e: "input", payload: TextInputValueEventPayload): void;
  (e: "change", payload: TextInputValueEventPayload): void;
  (e: "keydown", payload: TextInputKeyEventPayload): void;
  (e: "keyup", payload: TextInputKeyEventPayload): void;
  (e: "keydown:enter", payload: TextInputKeyEventPayload): void;
  (
    e: "compositionstart",
    payload: TextInputValueEventPayload<CompositionEvent>,
  ): void;
  (
    e: "compositionend",
    payload: TextInputValueEventPayload<CompositionEvent>,
  ): void;
}

export type TextInputRule<T = TextInputValue> = (
  value: T,
) => FieldValidationResult;