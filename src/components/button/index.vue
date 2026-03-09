<template>
  <component
    v-ripple="{ disabled: isDisabledForInteraction }"
    :is="tag"
    v-bind="isExternalLinkAttributes"
    :class="btnClass()"
    :type="type || 'button'"
    :style="style()"
    :aria-disabled="isDisabledForInteraction"
    :aria-busy="props.loading"
    :aria-label="ariaLabelComputed"
    @pointerenter="handleHover(true)"
    @pointerleave="handleHover(false)"
    @focus="handleFocus(true)"
    @blur="handleFocus(false)"
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
  IconProps,
  IconPath,
  ElevationProps,
  SizeProps,
  Size,
} from "@/types";
import { ripple } from "@/directives";
import EIcon from "@/components/icon/index.vue";

import { reactive, useAttrs, computed, useSlots } from "vue";
const vRipple = { ...ripple };

export interface ButtonProps extends ElevationProps, SizeProps {
  disabled?: boolean;
  link?: boolean;
  appendIcon?: Array<IconPath> | IconPath | string;
  prependIcon?: Array<IconPath> | IconPath | string;
  ariaLabel?: string;
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
  focused: false,
});
const attrs = useAttrs();
const props = withDefaults(defineProps<ButtonProps>(), {
  elevation: "sm",
});

const booleanClassKeys = [
  "disabled",
  "icon",
  "depressed",
  "text",
  "fab",
  "block",
  "loading",
  "outlined",
  "rounded",
  "stacked",
] as const;

const iconSize = computed((): Partial<IconProps> => ({ size: props.size }));
const tag = computed(() => {
  if (props.link) return "a";
  const { to } = attrs;
  if (typeof to === "string" && to.startsWith("http")) return "a";
  if (to) return "router-link";
  return "button";
});

const isExternalLinkAttributes = computed(() => {
  const { to } = attrs;
  if (typeof to === "string" && to.startsWith("http")) return { href: to };
  return {};
});

const slots = useSlots();
const isDisabledForInteraction = computed(() => props.disabled || props.loading);

const ariaLabelComputed = computed(() => {
  if (props.ariaLabel) return props.ariaLabel;
  if ((props.icon || props.fab) && !slots.default) return undefined;
  return undefined;
});

const btnClass = (): Array<string> => {
  const classes = ["e-btn v-ripple-element"];

  if (configuration.focused) {
    classes.push("e-btn--focused");
  }

  // Handle size
  const currentSize = props.size || "default";
  classes.push(`e-btn--size-${currentSize}`);

  // Handle boolean classes
  booleanClassKeys.forEach((key) => {
    if (props[key]) {
      classes.push(`e-btn--${key}`);
    }
  });

  // Handle elevation
  if (props.elevation && !props.depressed && !props.text && !props.outlined) {
    classes.push(`e-elevation--${props.elevation}`);
  }

  return classes;
};
const handleHover = (value: boolean) => {
  if (isDisabledForInteraction.value) return;
  configuration.hovered = value;
};

const handleFocus = (value: boolean) => {
  configuration.focused = value;
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
