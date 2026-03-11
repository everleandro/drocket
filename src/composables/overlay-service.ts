import { computed, reactive, ref, watch } from "vue";

type OverlayEntry = {
  id: string;
  dismissible: boolean;
  lockScroll: boolean;
  onOutsideClick?: () => void;
};

type OpenOverlayOptions = {
  id: string;
  dismissible?: boolean;
  lockScroll?: boolean;
  onOutsideClick?: () => void;
};

const state = reactive({
  stack: [] as OverlayEntry[],
});

const overlayMounted = ref(false);
const isOverlayActive = computed(() => state.stack.length > 0);
const overlayClassName = computed(() =>
  isOverlayActive.value ? "e-overlay--active" : "e-overlay--inactive"
);

let closeTimer: ReturnType<typeof setTimeout> | null = null;
let initialized = false;

const cleanupTimer = (): void => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
};

const syncBodyScroll = (): void => {
  if (typeof document === "undefined") return;

  const shouldLockScroll = state.stack.some((entry) => entry.lockScroll);
  document.body.style.overflow = shouldLockScroll ? "hidden" : "";
};

const ensureInitialized = (): void => {
  if (initialized) return;

  watch(
    () => isOverlayActive.value,
    (isActive) => {
      cleanupTimer();

      if (isActive) {
        overlayMounted.value = true;
      } else {
        closeTimer = setTimeout(() => {
          overlayMounted.value = false;
          closeTimer = null;
        }, 300);
      }

      syncBodyScroll();
    },
    { immediate: true }
  );

  initialized = true;
};

const openOverlay = ({
  id,
  dismissible = true,
  lockScroll = true,
  onOutsideClick,
}: OpenOverlayOptions): void => {
  const currentIndex = state.stack.findIndex((entry) => entry.id === id);
  const nextEntry: OverlayEntry = {
    id,
    dismissible,
    lockScroll,
    onOutsideClick,
  };

  if (currentIndex >= 0) {
    state.stack[currentIndex] = nextEntry;
    return;
  }

  state.stack.push(nextEntry);
};

const closeOverlay = (id: string): void => {
  const currentIndex = state.stack.findIndex((entry) => entry.id === id);
  if (currentIndex < 0) return;
  state.stack.splice(currentIndex, 1);
};

const closeAllOverlays = (): void => {
  state.stack.splice(0, state.stack.length);
};

const handleOverlayClick = (): void => {
  const activeOverlay = state.stack[state.stack.length - 1];
  if (!activeOverlay || !activeOverlay.dismissible) return;
  activeOverlay.onOutsideClick?.();
};

export default function useOverlayService() {
  ensureInitialized();

  return {
    overlayMounted,
    overlayClassName,
    isOverlayActive,
    openOverlay,
    closeOverlay,
    closeAllOverlays,
    handleOverlayClick,
  };
}
