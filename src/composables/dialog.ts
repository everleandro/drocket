import { useDialogService } from "./dialog-service";
import type { DialogOptions, PromptOptions } from "@/types";

type DialogMessage = string | DialogOptions;
type PromptMessage = string | PromptOptions;

const toOptions = <T extends DialogOptions>(message: string | T): T => {
  return (typeof message === "string" ? { message } : message) as T;
};

export const useDialog = () => {
  const { enqueue } = useDialogService();

  const alert = (message: DialogMessage): Promise<void> => enqueue("alert", toOptions(message));
  const confirm = (message: DialogMessage): Promise<boolean> => enqueue("confirm", toOptions(message));
  const prompt = (message: PromptMessage): Promise<string | null> => enqueue("prompt", toOptions(message));

  return { alert, confirm, prompt };
};

export default useDialog;
