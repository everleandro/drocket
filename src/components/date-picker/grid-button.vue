<template>
  <EButton v-bind="forwardedAttrs" :type="props.type" :elevation="props.elevation" :disabled="props.disabled"
    :class="buttonClass" @click="emit('click', $event)">
    <slot />
  </EButton>
</template>

<script lang="ts" setup>
import EButton from "@/components/button/index.vue";
import type { ElevationLevel } from "@/types";
import { computed, useAttrs } from "vue";

type ButtonElevation = ElevationLevel | "none";

interface DatePickerGridButtonProps {
  buttonClass?: string | Record<string, boolean> | Array<string | Record<string, boolean>>;
  disabled?: boolean;
  elevation?: ButtonElevation;
  type?: "button" | "submit" | "reset";
  tabindex?: number;
}

const props = withDefaults(defineProps<DatePickerGridButtonProps>(), {
  buttonClass: undefined,
  disabled: false,
  elevation: undefined,
  type: "button",
});

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const attrs = useAttrs();

const buttonClass = computed(() => {
  const classes: Array<string | Record<string, boolean>> = [];

  if (props.buttonClass !== undefined) {
    if (Array.isArray(props.buttonClass)) {
      classes.push(...props.buttonClass);
    } else {
      classes.push(props.buttonClass);
    }
  }

  if (props.elevation && props.elevation !== "none") {
    classes.push(`e-elevation--${props.elevation}`);
  }

  return classes;
});

const forwardedAttrs = computed(() => {
  return {
    ...attrs,
    "aria-disabled": props.disabled || undefined,
    tabindex: typeof props.tabindex === "number"
      ? props.tabindex
      : (props.disabled ? -1 : attrs.tabindex),
  };
});
</script>
