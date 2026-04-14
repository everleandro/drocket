<template>
  <span
    :class="circularClass"
    :style="circularStyle"
    :role="ariaHidden ? undefined : 'progressbar'"
    :aria-hidden="ariaHidden || undefined"
    :aria-valuemin="ariaHidden ? undefined : 0"
    :aria-valuemax="ariaHidden ? undefined : 100">
    <svg viewBox="0 0 46 46" style="transform: rotate(0deg)">
      <circle
        fill="transparent"
        cx="23"
        cy="23"
        r="20"
        class="e-progress-circular__overlay"
        :style="overlayStyle"></circle>
    </svg>
  </span>
</template>

<script lang="ts" setup>
import { computed } from "vue";

interface Props {
  ariaHidden?: boolean;
  indeterminate?: boolean;
  size?: number | string;
  strokeWidth?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  ariaHidden: true,
  indeterminate: true,
  size: 16,
  strokeWidth: 4,
});

const resolveCssSize = (value: number | string): string => {
  if (typeof value === "number") return `${value}px`;
  return value;
};

const circularClass = computed(() => ({
  "e-progress-circular": true,
  "e-progress-circular--visible": true,
  "e-progress-circular--indeterminate": props.indeterminate,
}));

const circularStyle = computed<Record<string, string>>(() => ({
  "--e-progress-circular-size": resolveCssSize(props.size),
  width: "var(--e-progress-circular-size)",
  height: "var(--e-progress-circular-size)",
}));

const overlayStyle = computed<Record<string, string>>(() => ({
  strokeWidth: resolveCssSize(props.strokeWidth),
  strokeDasharray: "125.664",
  strokeDashoffset: "125.66370614359172px",
}));
</script>
