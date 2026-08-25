import { ButtonProps } from "@/components/button/index.vue";
import type { Props as CardProps } from "@/components/card/index.vue";

export type SnackbarPosition =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end";

/** Which Card slot (prepend or append) hosts the close button. */
export type SnackbarCloseSlot =
  | "prepend"
  | "append"
  | "append-header"
  | "prepend-header";

export interface SnackbarAction extends Pick<
  ButtonProps,
  "color" | "outlined" | "text" | "elevation" | "tonal"
> {
  label: string;
  onClick?: (id: string) => void;
}

export interface SnackbarOptions extends CardProps {
  /** Rendered in Card's default slot; use `description` instead for the header-bound text. */
  message?: string;
  /** `false` disables the auto-dismiss timer. */
  timeout?: number | false;
  closable?: boolean;
  closeSlot?: SnackbarCloseSlot;
  position?: SnackbarPosition;
  action?: SnackbarAction;
}

export interface SnackbarInstance extends SnackbarOptions {
  id: string;
  createdAt: number;
}

export interface SnackbarPluginOptions {
  position?: SnackbarPosition;
  timeout?: number;
  maxVisible?: number;
  closable?: boolean;
  closeSlot?: SnackbarCloseSlot;
  /** Default Card props applied to every snackbar (e.g. elevation, tonal). */
  cardProps?: Partial<CardProps>;
}
