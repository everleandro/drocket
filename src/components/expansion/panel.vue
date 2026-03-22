<template>
	<div :class="expansionClass">
		<div class="e-expansion-panel__header">
			<button :class="buttonClass" :style="panelButtonHeaderStyle" @click="toggle" :aria-expanded="opened" :aria-controls="contentId"
				:id="headerId" :disabled="props.disabled">
				<span class="e-expansion-panel__header-button-content">
					<slot name="header">
						{{ headerTitle }}
					</slot>

					<div class="e-expansion-panel__header-button-icon">
						<EIcon :icon="headerButtonIcon" />
					</div>
				</span>
			</button>

			<div class="e-expansion-panel__header-actions">
				<slot name="actions" />
			</div>
		</div>

		<div class="e-expansion-panel__body">
			<ETransitionExpand>
				<div v-show="opened" class="e-expansion-panel__body-content" role="region" :aria-labelledby="headerId"
					:id="contentId">
					<div class="e-expansion-panel__body-content-wrapper">
						<slot />
					</div>
				</div>
			</ETransitionExpand>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, inject, ref, useId } from 'vue';
import icon from '@/utils/icons';
import { getColorCssValue } from '@/utils/style';
import { IconPath } from '@/types';
import ETransitionExpand from '@/components/transition/expand.vue';
import EIcon from '@/components/icon/index.vue';
import type { ElevationProps } from '@/types';
import { PanelsContext } from './panels.vue';
import {
	EXPANSION_PANELS_KEY,
	EXPANSION_PANELS_ELEVATION_KEY,
	EXPANSION_PANELS_COLOR_KEY,
} from './keys';

/**
 * Tipos
 */
type PanelValue = string | number;

export interface Props extends ElevationProps {
	dense?: boolean;
	headerTitle?: string;
	color?: string;
	modelValue?: boolean;
	collapsedIcon?: string | IconPath;
	expandedIcon?: string | IconPath;
	toggleIcon?: string | IconPath;
	disableIconRotation?: boolean;
	disabled?: boolean;
	value?: PanelValue;
}

/**
 * Props / Emits
 */
const props = withDefaults(defineProps<Props>(), {
	modelValue: undefined,
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
	(e: 'expand'): void;
	(e: 'collapse'): void;
	(e: 'toggle', value: boolean): void;
}>();

/**
 * Contexto
 */
const panelsContext = inject<PanelsContext | null>(EXPANSION_PANELS_KEY, null);
const panelsElevation = inject<ComputedRef<string | undefined> | undefined>(
	EXPANSION_PANELS_ELEVATION_KEY,
	undefined
);
const panelsColor = inject<ComputedRef<string | undefined> | undefined>(
	EXPANSION_PANELS_COLOR_KEY,
	undefined
);

/**
 * Estado local (solo si es uncontrolled)
 */
const local = ref(false);

const headerButtonIcon = computed(() => {
	if (opened.value) return props.expandedIcon ?? props.toggleIcon ?? icon.arrowDown;
	return props.collapsedIcon ?? props.toggleIcon ?? icon.arrowDown;
});

const rawId = useId();

const id = computed(() => {
	return props.value != null
		? `expansion-panel-${props.value}`
		: rawId;
});

const headerId = computed(() => `${id.value}-header`);
const contentId = computed(() => `${id.value}-content`);

/**
 * Value del panel
 */
const panelValue = computed<PanelValue>(() => {
	return props.value ?? id.value;
});

/**
 * Elevation
 */
const elevation = computed(() => {
	return props.elevation || panelsElevation?.value || 'sm';
});

const color = computed(() => {
	return props.color || panelsColor?.value || undefined;
});

const panelButtonHeaderStyle = computed((): Record<string, string> => {
  const result: Record<string, string> = {};


  // Inject color CSS variables for any color (predefined or custom)
  if (color.value) {
		const resolvedColor = getColorCssValue(color.value);

		if (resolvedColor) {
			result["--e-expansion-panel-button-color"] = resolvedColor;
		}
  }

  return result;
});
/**
 * Estado abierto (single source)
 */
const opened = computed<boolean>(() => {
	if (panelsContext) {
		const model = panelsContext.model.value;

		if (panelsContext.isMultiple.value) {
			return Array.isArray(model) && model.includes(panelValue.value);
		}

		return model === panelValue.value;
	}

	if (props.modelValue !== undefined) {
		return props.modelValue;
	}

	return local.value;
});

/**
 * Toggle
 */
const toggle = () => {
	if (props.disabled) return;

	const next = !opened.value;

	if (panelsContext) {
		panelsContext.updateSelected(panelValue.value);
		return;
	}

	if (props.modelValue === undefined) {
		local.value = next;
	} else {
		emit('update:modelValue', next);
	}

	emit('toggle', next);
	next ? emit('expand') : emit('collapse');
};

/**
 * Clases
 */
const expansionClass = computed(() => [
	'e-expansion-panel',
	props.dense && 'e-expansion-panel--dense',
	opened.value && 'e-expansion-panel--opened',
	props.disabled && 'e-expansion-panel--disabled',
	props.disableIconRotation && 'e-expansion-panel--disable-icon-rotation',
	elevation.value && `e-elevation--${elevation.value}`,
]);

const buttonClass = computed(() => [
	'e-expansion-panel__header-button',
]);
</script>

<style lang="scss" src="./style.scss"></style>