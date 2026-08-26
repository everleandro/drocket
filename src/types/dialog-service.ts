import type { ButtonProps } from "@/components/button/index.vue";

export type DialogKind = "alert" | "confirm" | "prompt";

export interface DialogButton extends Pick<ButtonProps, "color" | "text" | "outlined" | "elevation"> {
  label?: string;
}

export interface DialogOptions {
  title?: string;
  message?: string;
  color?: string;
  confirmButton?: DialogButton;
  cancelButton?: DialogButton;
}

export interface PromptOptions extends DialogOptions {
  placeholder?: string;
  defaultValue?: string;
}

export interface DialogInstance {
  id: string;
  kind: DialogKind;
  title?: string;
  message?: string;
  color?: string;
  confirmButton?: DialogButton;
  cancelButton?: DialogButton;
  placeholder?: string;
  inputValue: string;
  resolve: (value: unknown) => void;
}

export interface DialogPluginOptions {
  confirmLabel?: string;
  cancelLabel?: string;
  color?: string;
  confirmButton?: DialogButton;
  cancelButton?: DialogButton;
}
