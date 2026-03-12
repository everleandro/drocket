import { computed, reactive } from "vue";

type OverlayEntry = {
  id: string;
  dismissible: boolean;
  lockScroll: boolean;
  onOutsideClick?: () => void;
  onEscape?: () => void;
};

type OverlayRuntime = {
  element: HTMLDivElement;
  clickHandler: () => void;
  closeTimer: ReturnType<typeof setTimeout> | null;
};

type OpenOverlayOptions = {
  id: string;
  dismissible?: boolean;
  lockScroll?: boolean;
  onOutsideClick?: () => void;
  onEscape?: () => void;
};

const state = reactive({
  stack: [] as OverlayEntry[],
});

const isOverlayActive = computed(() => state.stack.length > 0);

let hasEscapeListener = false;
const overlayRuntimeById = new Map<string, OverlayRuntime>();
const OVERLAY_BASE_Z_INDEX = 3;
const OVERLAY_TRANSITION_MS = 300;

const getOverlayZIndex = (id: string): number | null => {
  const index = state.stack.findIndex((entry) => entry.id === id);
  if (index < 0) return null;
  return OVERLAY_BASE_Z_INDEX + index * 2;
};

const getStackZIndex = (id: string, offset = 0): number | null => {
  const overlayZIndex = getOverlayZIndex(id);
  if (overlayZIndex === null) return null;
  return overlayZIndex + offset;
};

const syncBodyScroll = (): void => {
  if (typeof document === "undefined") return;

  const shouldLockScroll = state.stack.some((entry) => entry.lockScroll);
  document.body.style.overflow = shouldLockScroll ? "hidden" : "";
};

const getActiveOverlay = (): OverlayEntry | undefined =>
  state.stack[state.stack.length - 1];

const destroyOverlayRuntime = (id: string): void => {
  const runtime = overlayRuntimeById.get(id);
  if (!runtime) return;

  if (runtime.closeTimer) {
    clearTimeout(runtime.closeTimer);
  }

  runtime.element.removeEventListener("click", runtime.clickHandler);
  runtime.element.remove();
  overlayRuntimeById.delete(id);
};

const scheduleOverlayDestroy = (id: string): void => {
  const runtime = overlayRuntimeById.get(id);
  if (!runtime) return;

  runtime.element.className = "e-overlay e-overlay--inactive";

  if (runtime.closeTimer) {
    clearTimeout(runtime.closeTimer);
  }

  runtime.closeTimer = setTimeout(() => {
    destroyOverlayRuntime(id);
  }, OVERLAY_TRANSITION_MS);
};

const ensureOverlayRuntime = (id: string): OverlayRuntime | null => {
  if (typeof document === "undefined") return null;

  const existingRuntime = overlayRuntimeById.get(id);
  if (existingRuntime) {
    if (existingRuntime.closeTimer) {
      clearTimeout(existingRuntime.closeTimer);
      existingRuntime.closeTimer = null;
    }
    return existingRuntime;
  }

  const element = document.createElement("div");
  element.className = "e-overlay e-overlay--inactive";

  const clickHandler = (): void => {
    const activeOverlay = getActiveOverlay();
    if (!activeOverlay || activeOverlay.id !== id || !activeOverlay.dismissible) {
      return;
    }
    activeOverlay.onOutsideClick?.();
  };

  element.addEventListener("click", clickHandler);
  document.body.appendChild(element);

  const runtime: OverlayRuntime = {
    element,
    clickHandler,
    closeTimer: null,
  };

  overlayRuntimeById.set(id, runtime);
  return runtime;
};

const handleEscapeKey = ({ key }: KeyboardEvent): void => {
  if (key !== "Escape") return;

  const activeOverlay = getActiveOverlay();
  if (!activeOverlay || !activeOverlay.dismissible) return;

  activeOverlay.onEscape?.();
};

const syncEscapeListener = (): void => {
  if (typeof document === "undefined") return;

  if (isOverlayActive.value && !hasEscapeListener) {
    document.addEventListener("keydown", handleEscapeKey);
    hasEscapeListener = true;
    return;
  }

  if (!isOverlayActive.value && hasEscapeListener) {
    document.removeEventListener("keydown", handleEscapeKey);
    hasEscapeListener = false;
  }
};

const syncOverlayElements = (): void => {
  if (typeof document === "undefined") return;

  syncEscapeListener();
  syncBodyScroll();

  const activeIds = new Set(state.stack.map((entry) => entry.id));

  state.stack.forEach((entry, index) => {
    const runtime = ensureOverlayRuntime(entry.id);
    if (!runtime) return;

    runtime.element.className = "e-overlay e-overlay--active";
    runtime.element.style.zIndex = `${OVERLAY_BASE_Z_INDEX + index * 2}`;
  });

  overlayRuntimeById.forEach((_, id) => {
    if (!activeIds.has(id)) {
      scheduleOverlayDestroy(id);
    }
  });
};

const openOverlay = ({
  id,
  dismissible = true,
  lockScroll = true,
  onOutsideClick,
  onEscape,
}: OpenOverlayOptions): void => {
  const currentIndex = state.stack.findIndex((entry) => entry.id === id);
  const nextEntry: OverlayEntry = {
    id,
    dismissible,
    lockScroll,
    onOutsideClick,
    onEscape,
  };

  if (currentIndex >= 0) {
    state.stack[currentIndex] = nextEntry;
    syncOverlayElements();
    return;
  }

  state.stack.push(nextEntry);
  syncOverlayElements();
};

const closeOverlay = (id: string): void => {
  const currentIndex = state.stack.findIndex((entry) => entry.id === id);
  if (currentIndex < 0) return;
  state.stack.splice(currentIndex, 1);
  syncOverlayElements();
};

const closeAllOverlays = (): void => {
  state.stack.splice(0, state.stack.length);
  syncOverlayElements();
};

export default function useOverlayService() {
  return {
    isOverlayActive,
    getStackZIndex,
    openOverlay,
    closeOverlay,
    closeAllOverlays,
  };
}
