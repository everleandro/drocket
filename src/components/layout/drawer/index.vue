<template>
  <component
    :is="tag"
    v-click-outside="handleOutside"
    :class="drawerClass"
    data-layout="true"
    :style="style"
  >
    <div
      class="e-drawer__content"
      :style="{
        width: props.floating ? `calc(${computedWidth} - 24px)` : computedWidth,
      }"
    >
      <div v-if="right" class="e-drawer__border"></div>
      <div v-if="slots.prepend" class="e-drawer__prepend">
        <slot name="prepend"></slot>
      </div>
      <div class="e-drawer__body">
        <slot></slot>
      </div>
      <div v-if="!right" class="e-drawer__border"></div>
      <div v-if="slots.append" class="e-drawer__append">
        <slot name="append"></slot>
      </div>
    </div>
  </component>
</template>

<script lang="ts" setup>
import { clickOutside } from "@/directives";
const vClickOutside = { ...clickOutside };
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  useSlots,
} from "vue";
// import { useRouter } from 'vue-router'
const slots = useSlots();

export type DrawerClassKeys =
  | "disabled"
  | "right"
  | "modelValue"
  | "fixed"
  | "floating";

export interface Props {
  modelValue?: boolean;
  floating?: boolean;
  absolute?: boolean;
  disabled?: boolean;
  fixed?: boolean;
  devMode?: boolean; //only for dev purpose
  nav?: boolean;
  right?: boolean;
  widthUnit?: string;
  width?: string | number;
}

let mdBreakpoint = ref(false);
const props = withDefaults(defineProps<Props>(), {
  width: 16,
  widthUnit: "rem",
});

let overlayNode: HTMLElement | null = null;

const availableRootClasses: Record<DrawerClassKeys, string> = {
  disabled: "e-drawer--disabled",
  right: "e-drawer--right",
  fixed: "e-drawer--fixed",
  floating: "e-drawer--floating",
  modelValue: "e-drawer--open",
};

// const router = useRouter()
const absoluteComputed = computed(() => {
  if (props.devMode) return props.absolute;
  return props.absolute || mdBreakpoint.value;
});
const tag = computed(() => (props.nav ? "nav" : "aside"));

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

onMounted(() => {
  setOverlay();
  observeBreakpoint();
  refreshLayoutStyle();
  if (props.devMode) return;
  nextTick(() => {
    window?.addEventListener("resize", observeBreakpoint);
    if (props.modelValue && mdBreakpoint.value) {
      changeValue(false);
    }
  });
});

onUnmounted(() => {
  window?.removeEventListener("resize", observeBreakpoint);
  destroyOverlay();
});

const drawerClass = computed((): Array<string> => {
  const classes = ["e-drawer"];
  const availableRootClassKeys = Object.keys(
    availableRootClasses
  ) as Array<DrawerClassKeys>;
  absoluteComputed.value && classes.push("e-drawer--absolute");
  !props.modelValue && classes.push("e-drawer--close");

  const classes2 = availableRootClassKeys
    .filter((key) => !!props[key])
    .map((key) => availableRootClasses[key]);

  return [...classes, ...classes2];
});
const computedWidth = computed(() => {
  let result = props.width;
  if (typeof props.width === "number") {
    result = `${props.width}${props.widthUnit}`;
  } else if (
    props.width.length === parseInt(props.width, 10).toString().length
  ) {
    result = `${props.width}${props.widthUnit}`;
  }

  return result;
});

watch(
  () => [props.modelValue, mdBreakpoint.value, props.absolute, props.fixed],
  () => {
    setOverlay();
    refreshLayoutStyle();
  }
);

watch(
  () => [props.right, props.width],
  () => {
    refreshLayoutStyle();
  }
);

// watch(() => route.fullPath, () => {
//   console.log('ads')

// }, { deep: true })

// watch(() => router, () => {
//   if (props.modelValue && mdBreakpoint.value) {
//     changeValue(false)
//   }

// }, { deep: true, immediate: true });

const setOverlay = (): void => {
  if (props.modelValue && absoluteComputed.value) {
    if (!overlayNode) {
      const root: HTMLElement = document.body || new HTMLElement();
      const appParent: HTMLElement =
        document.querySelector("#app.e-app") || new HTMLElement();
      const parent = root.contains(appParent) ? appParent : root;
      const newOverlayNode = document.createElement("div");
      parent.prepend(newOverlayNode);
      newOverlayNode.className = "e-overlay";
      setTimeout(() => {
        newOverlayNode.className = "e-overlay e-overlay--active";
      }, 0);
      overlayNode = newOverlayNode;
    }
  } else {
    destroyOverlay();
  }
};

const refreshLayoutStyle = (): void => {
  const eMainNode = document.querySelector(
    '.e-main[data-layout="true"]'
  ) as HTMLElement;
  const eBarNode = document.querySelector(
    '.e-bar.e-bar--app[data-layout="true"]'
  ) as HTMLElement;
  const propertyValue =
    absoluteComputed.value || !props.modelValue
      ? "0px"
      : `${computedWidth.value}`;
  if (eMainNode) {
    if (props.right) {
      eMainNode.style.paddingRight = propertyValue;
      eMainNode.style.paddingLeft = "0px";
    } else {
      eMainNode.style.paddingRight = "0px";
      eMainNode.style.paddingLeft = propertyValue;
    }
  }

  if (eBarNode) {
    if (props.right) {
      eBarNode.style.right = propertyValue;
      eBarNode.style.left = "0px";
    } else {
      eBarNode.style.right = "0px";
      eBarNode.style.left = propertyValue;
    }
  }
};

const destroyOverlay = (): void => {
  if (overlayNode) {
    overlayNode.className = "e-overlay e-overlay--inactive";
    setTimeout(() => {
      overlayNode && (overlayNode as HTMLElement).remove();
      overlayNode = null;
    }, 300);
  }
};
const changeValue = (value: boolean): void => {
  emit("update:modelValue", value);
};
const observeBreakpoint = (): void => {
  const windowWidth = window?.innerWidth;
  const mdValue = getComputedStyle(document.body).getPropertyValue("--md");
  mdBreakpoint.value = windowWidth <= parseInt(mdValue, 10);
};
const handleOutside = (): void => {
  if (absoluteComputed.value && props.modelValue) {
    changeValue(false);
    destroyOverlay();
  }
};
const style = computed((): Record<string, string> => {
  const translateX = props.modelValue ? "0%" : `${props.right ? "" : "-"}100%`;
  const result: Record<string, string> = {
    height: "100%",
    top: "0px",
    transform: `translateX(${translateX})`,
  };

  return { ...result };
});
</script>
<style lang="scss">
@import "./style.scss";
</style>
