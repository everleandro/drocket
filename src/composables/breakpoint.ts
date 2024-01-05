export type breakpointKey = "xs" | "sm" | "md" | "lg";
import { ref, reactive, onMounted, onUnmounted } from "vue";
export default function () {
  const viewport = reactive({
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
  });
  const xs = ref(0);
  const sm = ref(0);
  const md = ref(0);
  const lg = ref(0);
  let timer = 0;

  onMounted(() => {
    xs.value = integerFromKey("--xs");
    sm.value = integerFromKey("--sm");
    md.value = integerFromKey("--md");
    lg.value = integerFromKey("--lg");
    observeBreakpoint();
    window?.addEventListener("resize", observeBreakpoint);
  });

  onUnmounted(() => window?.removeEventListener("resize", observeBreakpoint));

  const integerFromKey = (key: string): number => {
    return parseInt(getComputedStyle(document.body).getPropertyValue(key), 10);
  };

  const observeBreakpoint = (): void => {
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window?.setTimeout(() => {
      const windowWidth = window?.innerWidth || 0;
      viewport.xs = windowWidth <= xs.value;
      viewport.sm = windowWidth > xs.value && windowWidth <= sm.value;
      viewport.md = windowWidth > sm.value && windowWidth <= md.value;
      viewport.lg = windowWidth > md.value && windowWidth <= lg.value;
      viewport.xl = windowWidth > lg.value;
    }, 300);
  };

  return { viewport };
}
