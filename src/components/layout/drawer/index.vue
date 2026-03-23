<template>
  <component
    :is="tag"
    v-click-outside="handleOutside"
    :class="drawerClass"
    data-layout="true"
    :style="mergedStyle"
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
const vClickOutside = clickOutside;
import { computed, onMounted, onUnmounted, ref, watch, useSlots } from "vue";
import { useLayout, useOverlayService } from "@/composables";
import { DrawerClassKeys, DrawerProps } from "@/types";

const slots = useSlots();
const { setLayoutConfig, drawerLayoutStyle } = useLayout();
const { openOverlay, closeOverlay } = useOverlayService();

let mdBreakpoint = ref(false);
const props = withDefaults(defineProps<DrawerProps>(), {
  width: 16,
  widthUnit: "rem",
});
let mediaQueryList: MediaQueryList | null = null;
const overlayId = `drawer-overlay-${Math.random().toString(36).slice(2)}`;

const availableRootClasses: Record<DrawerClassKeys, string> = {
  disabled: "e-drawer--disabled",
  right: "e-drawer--right",
  fixed: "e-drawer--fixed",
  floating: "e-drawer--floating",
  modelValue: "e-drawer--open",
};

const absoluteComputed = computed(() => {
  if (props.devMode) return props.absolute;
  return props.absolute || mdBreakpoint.value;
});
const tag = computed(() => (props.nav ? "nav" : "aside"));
const overlayActive = computed(
  () => !!props.modelValue && !!absoluteComputed.value
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

onMounted(() => {
  observeBreakpoint();

  if (props.modelValue && mdBreakpoint.value && !props.devMode) {
    changeValue(false);
  }
});

onUnmounted(() => {
  if (mediaQueryList) {
    mediaQueryList.removeEventListener("change", onBreakpointChange);
    mediaQueryList = null;
  }

  closeOverlay(overlayId);
  setLayoutConfig({ drawer: { left: "0px", right: "0px" } });
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
  if (typeof props.width === "number") {
    return `${props.width}${props.widthUnit}`;
  }

  const trimmedWidth = props.width.trim();
  if (/^\d+(\.\d+)?$/.test(trimmedWidth)) {
    return `${trimmedWidth}${props.widthUnit}`;
  }

  return trimmedWidth;
});

function refreshLayoutStyle(): void {
  const propertyValue =
    absoluteComputed.value || !props.modelValue
      ? "0px"
      : `${computedWidth.value}`;
  setLayoutConfig({
    drawer: {
      left: props.right ? "0px" : propertyValue,
      right: props.right ? propertyValue : "0px",
    },
  });
}

watch(
  () => [props.modelValue, props.right, computedWidth.value, absoluteComputed.value],
  () => {
    refreshLayoutStyle();
  },
  { immediate: true }
);

const changeValue = (value: boolean): void => {
  emit("update:modelValue", value);
};

const onBreakpointChange = (event: MediaQueryListEvent): void => {
  mdBreakpoint.value = event.matches;
};

const observeBreakpoint = (): void => {
  const mdValue = getComputedStyle(document.body).getPropertyValue("--md").trim();
  const parsedMd = parseInt(mdValue, 10);
  const mdBreakpointValue = Number.isNaN(parsedMd) ? 960 : parsedMd;

  mediaQueryList = window.matchMedia(`(max-width: ${mdBreakpointValue}px)`);
  mdBreakpoint.value = mediaQueryList.matches;
  mediaQueryList.addEventListener("change", onBreakpointChange);
};

function handleOutside(): void {
  if (absoluteComputed.value && props.modelValue) {
    changeValue(false);
  }
}

watch(
  () => overlayActive.value,
  (isActive) => {
    if (isActive) {
      openOverlay({
        id: overlayId,
        dismissible: true,
        onOutsideClick: handleOutside,
      });
      return;
    }

    closeOverlay(overlayId);
  },
  { immediate: true }
);

const style = computed((): Record<string, string> => {
  const translateX = props.modelValue ? "0%" : `${props.right ? "" : "-"}100%`;
  const result: Record<string, string> = {
    height: "100%",
    top: "0px",
    transform: `translateX(${translateX})`,
  };

  return { ...result };
});

const mergedStyle = computed((): Record<string, string> => ({
  ...drawerLayoutStyle,
  ...style.value,
}));
</script>
<style lang="scss" src="./style.scss"></style>
