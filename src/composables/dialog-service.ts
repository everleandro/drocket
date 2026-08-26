import { computed, reactive } from "vue";
import type {
  DialogButton,
  DialogInstance,
  DialogKind,
  DialogPluginOptions,
  PromptOptions,
} from "@/types";

const DEFAULT_CONFIRM_BUTTON: DialogButton = {
  color: "primary",
  label: "Accept",
};

const DEFAULT_CANCEL_BUTTON: DialogButton = {
  text: true,
  label: "Cancel",
};

interface DialogConfig {
  color?: string;
}

const config: DialogConfig = reactive({});

// Kept outside `reactive()`: nested ButtonProps unions are deep enough to blow up vue-tsc's type instantiation.
let confirmButtonDefaults: DialogButton = {
  ...DEFAULT_CONFIRM_BUTTON,
};
let cancelButtonDefaults: DialogButton = { ...DEFAULT_CANCEL_BUTTON };

export const configureDialog = (options: DialogPluginOptions = {}): void => {
  if (options.color !== undefined) config.color = options.color;
  if (options.confirmLabel)
    confirmButtonDefaults = { ...confirmButtonDefaults, label: options.confirmLabel };
  if (options.cancelLabel)
    cancelButtonDefaults = { ...cancelButtonDefaults, label: options.cancelLabel };
  if (options.confirmButton)
    confirmButtonDefaults = {
      ...confirmButtonDefaults,
      ...options.confirmButton,
    };
  if (options.cancelButton)
    cancelButtonDefaults = {
      ...cancelButtonDefaults,
      ...options.cancelButton,
    };
};

// Only one dialog is ever shown; extra requests queue and appear once the active one resolves.
const state: { queue: DialogInstance[] } = reactive({ queue: [] });

let uid = 0;
const nextId = (): string => `dialog-${Date.now()}-${uid++}`;

const current = computed((): DialogInstance | undefined => state.queue[0]);
const isActive = computed((): boolean => state.queue.length > 0);

const findEntry = (id: string): DialogInstance | undefined => {
  return state.queue.find((entry) => entry.id === id);
};

const settle = (id: string, value: unknown): void => {
  const index = state.queue.findIndex((entry) => entry.id === id);
  if (index < 0) return;

  const [entry] = state.queue.splice(index, 1);
  entry.resolve(value);
};

const enqueue = <T>(kind: DialogKind, options: PromptOptions): Promise<T> => {
  return new Promise<T>((resolve) => {
    state.queue.push({
      id: nextId(),
      kind,
      title: options.title,
      message: options.message,
      color: options.color ?? config.color,
      confirmButton: {
        ...confirmButtonDefaults,
        ...options.confirmButton,
      },
      cancelButton: {
        ...cancelButtonDefaults,
        ...options.cancelButton,
      },
      placeholder: options.placeholder,
      inputValue: options.defaultValue ?? "",
      resolve: resolve as (value: unknown) => void,
    });
  });
};

const confirmDialog = (id: string): void => {
  const entry = findEntry(id);
  if (!entry) return;

  settle(id, entry.kind === "prompt" ? entry.inputValue : true);
};

const cancelDialog = (id: string): void => {
  const entry = findEntry(id);
  if (!entry) return;

  settle(
    id,
    entry.kind === "prompt"
      ? null
      : entry.kind === "confirm"
        ? false
        : undefined,
  );
};

const updateInputValue = (id: string, value: string): void => {
  const entry = findEntry(id);
  if (entry) entry.inputValue = value;
};

export const useDialogService = () => ({
  current,
  isActive,
  confirmDialog,
  cancelDialog,
  updateInputValue,
  enqueue,
});

export default useDialogService;
