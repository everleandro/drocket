<template>
  <component
    v-ripple
    :is="tag"
    v-bind="isExteranlLinkAttributes"
    :class="btnClass()"
    :type="type || 'button'"
    :style="style()"
    @mouseover="handleHover(true)"
    @mouseleave="handleHover(false)"
  >
    <span v-show="props.loading" class="e-btn__loader">
      <slot name="loading">
        <span
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          class="e-progress-circular e-progress-circular--visible e-progress-circular--indeterminate"
          style="height: 23px; width: 23px"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="21.904761904761905 21.904761904761905 43.80952380952381 43.80952380952381"
            style="transform: rotate(0deg)"
          >
            <circle
              fill="transparent"
              cx="43.80952380952381"
              cy="43.80952380952381"
              r="20"
              stroke-width="3.8095238095238093"
              stroke-dasharray="125.664"
              stroke-dashoffset="125.66370614359172px"
              class="e-progress-circular__overlay"
            ></circle>
          </svg>
        </span>
      </slot>
    </span>
    <span v-if="prependIcon" class="e-btn__prepend">
      <EIcon v-bind="iconSize" :icon="prependIcon" />
    </span>
    <span class="e-btn__content">
      <slot name="default">
        <template v-if="icon || fab">
          <EIcon v-bind="iconSize" :icon="icon" />
        </template>
      </slot>
    </span>
    <span v-if="appendIcon" class="e-btn__append">
      <EIcon v-bind="iconSize" :icon="appendIcon" />
    </span>
  </component>
</template>
<script lang="ts" setup>
import {
  ButtonClassKeys,
  IconProps,
  IconPath,
  ElevationProps,
  SizeProps,
  Size,
} from "@/types";
import { ripple } from "@/directives";
import EIcon from "@/components/icon/index.vue";

import { reactive, useAttrs, computed } from "vue";
const vRipple = { ...ripple };

export interface ButtonProps extends ElevationProps, SizeProps {
  disabled?: boolean;
  link?: boolean;
  appendIcon?: Array<IconPath> | IconPath | string;
  prependIcon?: Array<IconPath> | IconPath | string;
  ripple?: boolean;
  loading?: boolean;
  color?: string;
  hoverColor?: string;
  fab?: boolean;
  depressed?: boolean;
  text?: boolean;
  outlined?: boolean;
  block?: boolean;
  type?: string;
  rounded?: boolean;
  stacked?: boolean;
  icon?: Array<IconPath> | IconPath | string;
  height?: string | number;
  width?: string | number;
}

const configuration = reactive({
  hovered: false,
});
const attrs = useAttrs();
const props = defineProps<ButtonProps>();

const availableRootClasses: Record<ButtonClassKeys, string> = {
  disabled: "e-btn--disabled",
  icon: "e-btn--icon",
  depressed: "e-btn--depressed",
  text: "e-btn--text",
  ripple: "v-ripple-element",
  fab: "e-btn--fab",
  block: "e-btn--block",
  loading: "e-btn--loading",
  outlined: "e-btn--outlined",
  rounded: "e-btn--rounded",
  stacked: "e-btn--stacked",
};

const iconSize = computed((): Partial<IconProps> => ({ size: props.size }));
const tag = computed(() => {
  if (props.link) return "a";
  const { to } = attrs;
  if (typeof to === "string" && to.startsWith("http")) return "a";
  if (to) return "router-link";
  return "button";
});

const isExteranlLinkAttributes = computed(() => {
  const { to } = attrs;
  if (typeof to === "string" && to.startsWith("http")) return { href: to };
  return {};
});

const btnClass = (): Array<string> => {
  const classes = ["e-btn v-ripple-element"];

  // Handle size
  const currentSize = props.size || "default";
  classes.push(`e-btn--size-${currentSize}`);

  // Handle boolean classes
  const availableRootClassKeys = Object.keys(
    availableRootClasses,
  ) as Array<ButtonClassKeys>;
  const classes2 = availableRootClassKeys
    .filter((key) => !!props[key])
    .map((key) => availableRootClasses[key]);

  // Handle elevation
  if (props.elevation) {
    classes2.push(`e-elevation--${props.elevation}`);
  }

  return [...classes, ...classes2];
};
const handleHover = (value: boolean) => {
  configuration.hovered = value;
};

const getCurrentColor = (): string | undefined => {
  if (configuration.hovered && props.hoverColor) return props.hoverColor;
  return props.color;
};

const style = (): Record<string, string> => {
  const result: Record<string, string> = {};
  props.height && (result.height = `${props.height}px !important`);
  props.width && (result.width = `${props.width}px !important`);

  // Inject color CSS variables for any color (predefined or custom)
  const currentColor = getCurrentColor();
  if (currentColor) {
    result["--btn-bg"] = `var(--e-color-${currentColor})`;
    result["--btn-text"] = `var(--e-contrast-${currentColor}, white)`;
  }

  return result;
};
</script>

<style lang="scss" src="./style.scss"></style>
