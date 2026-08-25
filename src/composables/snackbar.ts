import { useSnackbarService } from "./snackbar-service";
import type { SnackbarOptions, SnackbarPosition } from "@/types";

type SnackbarMessage = string | Omit<SnackbarOptions, "color">;

const toOptions = (
  message: SnackbarMessage,
  color: string,
): SnackbarOptions => {
  const options =
    typeof message === "string" ? { message } : message;
  return { color, ...options };
};

export const useSnackbar = () => {
  const { push, dismiss, clear } = useSnackbarService();

  const show = (options: SnackbarOptions): string => push(options);
  const success = (message: SnackbarMessage): string =>
    push(toOptions(message, "success"));
  const error = (message: SnackbarMessage): string =>
    push(toOptions(message, "error"));
  const warning = (message: SnackbarMessage): string =>
    push(toOptions(message, "warning"));
  const info = (message: SnackbarMessage): string =>
    push(toOptions(message, "info"));

  const clearAll = (position?: SnackbarPosition): void => clear(position);

  return { show, success, error, warning, info, dismiss, clear: clearAll };
};

export default useSnackbar;
