import type { ButtonProps } from "@/components/button/index.vue";
import type { ElevationLevel } from "./elevation";
import type { IconPath } from "./icon";

export type SnackbarPosition =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end";

/** `none` opts a single snackbar out of the configured default elevation. */
export type SnackbarElevation = ElevationLevel | "none";

/** Which side of the snackbar hosts the close button. */
export type SnackbarCloseSlot = "start" | "end";

export interface SnackbarAction extends Pick<
  ButtonProps,
  "color" | "outlined" | "text" | "elevation" | "tonal"
> {
  label: string;
  onClick?: (id: string) => void;
}

export interface SnackbarOptions {
  title?: string;
  message?: string;
  color?: string;
  tonal?: boolean;
  outlined?: boolean;
  elevation?: SnackbarElevation;
  icon?: Array<IconPath> | IconPath | string;
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
  /** Default surface props applied to every snackbar (elevation/tonal/outlined). */
  surfaceProps?: Partial<Pick<SnackbarOptions, "elevation" | "tonal" | "outlined">>;
  /** Default action button props applied to every snackbar action (e.g. tonal). */
  actionProps?: Partial<SnackbarAction>;
}
