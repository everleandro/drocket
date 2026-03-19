<template>
  <div :class="panelsClass">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, provide, ComputedRef, ref } from 'vue';
import type { ElevationProps } from '@/types'; import {
  EXPANSION_PANELS_KEY,
  EXPANSION_PANELS_ELEVATION_KEY,
  EXPANSION_PANELS_COLOR_KEY,
} from './keys';

/**
 * Tipos
 */
type PanelValue = string | number;
type ModelValue = PanelValue | PanelValue[] | undefined;

export interface PanelsProps extends ElevationProps {
  accordion?: boolean;
  modelValue?: ModelValue;
  color?: string;
}

export interface PanelsContext {
  model: ComputedRef<ModelValue>;
  updateSelected: (val: PanelValue) => void;
  isMultiple: ComputedRef<boolean>;
}

/**
 * Props
 */
const props = withDefaults(defineProps<PanelsProps>(), {
  elevation: 'sm',
  color: undefined,
  accordion: false,
});

/**
 * Emits
 */
const emit = defineEmits<{
  (e: 'update:modelValue', value: ModelValue): void;
}>();

/**
 * Modo (single vs multiple)
 * accordion = fuerza modo single
 */
const isMultiple = computed(() => {
  if (props.accordion) return false;
  return Array.isArray(props.modelValue) || props.modelValue === undefined;
});

const isControlled = computed(() => props.modelValue !== undefined);

const internal = ref<ModelValue>(
  props.accordion ? undefined : []
);

/**
 * v-model controlado (single source of truth)
 */
const model = computed<ModelValue>({
  get: () => (isControlled.value ? props.modelValue : internal.value),
  set: (val) => {
    if (isControlled.value) {
      emit('update:modelValue', val);
    } else {
      internal.value = val;
    }
  },
});

/**
 * Lógica de selección
 */
const updateSelected = (value: PanelValue) => {
  if (isMultiple.value) {
    const current = Array.isArray(model.value) ? [...model.value] : [];
    const exists = current.includes(value);

    model.value = exists
      ? current.filter(v => v !== value)
      : [...current, value];

    return;
  }

  model.value = model.value === value ? undefined : value;
};


provide(EXPANSION_PANELS_KEY, {
  model,
  updateSelected,
  isMultiple,
});

provide(EXPANSION_PANELS_ELEVATION_KEY, computed(() => props.elevation));
provide(EXPANSION_PANELS_COLOR_KEY, computed(() => props.color));

/**
 * Clases reactivas
 */
const panelsClass = computed(() => [
  'e-expansion-panels',
  props.accordion && 'e-expansion-panels--accordion',
  !props.accordion && 'e-expansion-panels--default',
  isMultiple.value && 'e-expansion-panels--multiple',
]);
</script>