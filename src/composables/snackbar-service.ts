import { computed, reactive } from "vue";
import type {
  SnackbarAction,
  SnackbarCloseSlot,
  SnackbarElevation,
  SnackbarInstance,
  SnackbarOptions,
  SnackbarPluginOptions,
  SnackbarPosition,
} from "@/types";

const DEFAULT_POSITION: SnackbarPosition = "bottom-end";
const DEFAULT_TIMEOUT = 4000;
const DEFAULT_MAX_VISIBLE = 3;
const DEFAULT_ACTION_PROPS: Partial<SnackbarAction> = {
  tonal: true,
};
const DEFAULT_CLOSE_SLOT: SnackbarCloseSlot = "end";
const DEFAULT_SURFACE_PROPS: { elevation: SnackbarElevation; tonal: boolean; outlined: boolean } = {
  elevation: "md",
  tonal: false,
  outlined: false,
};

interface SnackbarConfig {
  position: SnackbarPosition;
  timeout: number | false;
  maxVisible: number;
  closable: boolean;
  closeSlot: SnackbarCloseSlot;
}

const config: SnackbarConfig = reactive({
  position: DEFAULT_POSITION,
  timeout: DEFAULT_TIMEOUT,
  maxVisible: DEFAULT_MAX_VISIBLE,
  closable: true,
  closeSlot: DEFAULT_CLOSE_SLOT,
});

// Kept outside `reactive()`: nested action/button prop unions are deep enough to blow up vue-tsc's type instantiation.
let surfacePropsDefaults: Partial<Pick<SnackbarOptions, "elevation" | "tonal" | "outlined">> = {
  ...DEFAULT_SURFACE_PROPS,
};
let actionPropsDefaults: Partial<SnackbarAction> = { ...DEFAULT_ACTION_PROPS };

export const configureSnackbar = (
  options: SnackbarPluginOptions = {},
): void => {
  if (options.position) config.position = options.position;
  if (options.timeout !== undefined) config.timeout = options.timeout;
  if (options.maxVisible !== undefined) config.maxVisible = options.maxVisible;
  if (options.closable !== undefined) config.closable = options.closable;
  if (options.closeSlot) config.closeSlot = options.closeSlot;
  if (options.actionProps)
    actionPropsDefaults = { ...actionPropsDefaults, ...options.actionProps };
  if (options.surfaceProps)
    surfacePropsDefaults = { ...surfacePropsDefaults, ...options.surfaceProps };
};

const state: { queue: SnackbarInstance[] } = reactive({
  queue: [],
});

const timersById = new Map<string, ReturnType<typeof setTimeout>>();
let uid = 0;
const nextId = (): string => `snackbar-${Date.now()}-${uid++}`;

const clearTimer = (id: string): void => {
  const timer = timersById.get(id);
  if (!timer) return;

  clearTimeout(timer);
  timersById.delete(id);
};

const dismiss = (id: string): void => {
  clearTimer(id);
  const index = state.queue.findIndex((entry) => entry.id === id);
  if (index >= 0) state.queue.splice(index, 1);
};

const scheduleTimeout = (entry: SnackbarInstance): void => {
  const timeout = entry.timeout ?? config.timeout;
  if (timeout === false || timeout <= 0) return;

  clearTimer(entry.id);
  timersById.set(
    entry.id,
    setTimeout(() => dismiss(entry.id), timeout),
  );
};

// Hover/focus pauses the timer; leaving restarts it from the configured duration.
const pause = (id: string): void => clearTimer(id);
const resume = (id: string): void => {
  const entry = state.queue.find((item) => item.id === id);
  if (entry) scheduleTimeout(entry);
};

const push = (options: SnackbarOptions): string => {
  const id = nextId();
  const entry: SnackbarInstance = {
    ...surfacePropsDefaults,
    ...options,
    closable: options.closable ?? config.closable,
    closeSlot: options.closeSlot ?? config.closeSlot,
    action: options.action ? { ...actionPropsDefaults, ...options.action } : undefined,
    id,
    createdAt: Date.now(),
  };

  state.queue.push(entry);
  scheduleTimeout(entry);
  return id;
};

const groupByPosition = (position: SnackbarPosition): SnackbarInstance[] => {
  return state.queue.filter(
    (entry) => (entry.position ?? config.position) === position,
  );
};

const clear = (position?: SnackbarPosition): void => {
  const toRemove = position ? groupByPosition(position) : [...state.queue];
  toRemove.forEach((entry) => dismiss(entry.id));
};

const activePositions = computed((): SnackbarPosition[] => {
  const positions = new Set<SnackbarPosition>();
  state.queue.forEach((entry) =>
    positions.add(entry.position ?? config.position),
  );
  return [...positions];
});

const visibleByPosition = (position: SnackbarPosition) => {
  return computed(() => groupByPosition(position).slice(0, config.maxVisible));
};

export const useSnackbarService = () => ({
  push,
  dismiss,
  clear,
  pause,
  resume,
  activePositions,
  visibleByPosition,
});

export default useSnackbarService;
