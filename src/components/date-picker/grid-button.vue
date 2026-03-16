<template>
  <EButton
    v-bind="forwardedAttrs"
    :type="props.type"
    :text="props.text"
    :outlined="props.outlined"
    :depressed="props.depressed"
    :block="props.block"
    :size="props.size"
    :color="props.color"
    :disabled="props.disabled"
    :class="props.buttonClass"
    @click="emit('click', $event)"
  >
    <slot />
  </EButton>
</template>

<script lang="ts" setup>
import EButton from "@/components/button/index.vue";
import { computed, useAttrs } from "vue";

interface DatePickerGridButtonProps {
  block?: boolean;
  buttonClass?: string | Record<string, boolean> | Array<string | Record<string, boolean>>;
  color?: string;
  depressed?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  size?: "x-small" | "small" | "default" | "large" | "x-large";
  text?: boolean;
  type?: string;
  tabindex?: number;
}

const props = withDefaults(defineProps<DatePickerGridButtonProps>(), {
  block: false,
  buttonClass: undefined,
  color: undefined,
  depressed: false,
  disabled: false,
  outlined: false,
  size: "default",
  text: false,
  type: "button",
});

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const attrs = useAttrs();

const forwardedAttrs = computed(() => {
  return {
    ...attrs,
    "aria-disabled": props.disabled || undefined,
    tabindex: typeof props.tabindex === 'number' ? props.tabindex : (props.disabled ? -1 : attrs.tabindex),
  };
});
</script>
