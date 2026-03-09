import { computed, onUnmounted, ref, watch, type Ref } from "vue";

type UseOverlayOptions = {
  active: Ref<boolean>;
  leaveDuration?: number;
};

export default function useOverlay({
  active,
  leaveDuration = 300,
}: UseOverlayOptions) {
  const mounted = ref(false);
  let closeTimer: ReturnType<typeof setTimeout> | null = null;

  const className = computed(() =>
    active.value ? "e-overlay--active" : "e-overlay--inactive"
  );

  watch(
    () => active.value,
    (isActive) => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }

      if (isActive) {
        mounted.value = true;
        return;
      }

      closeTimer = setTimeout(() => {
        mounted.value = false;
        closeTimer = null;
      }, leaveDuration);
    },
    { immediate: true }
  );

  onUnmounted(() => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  });

  return {
    overlayMounted: mounted,
    overlayClassName: className,
  };
}
