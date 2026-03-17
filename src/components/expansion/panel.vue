<template>
	<div :class="expansionClass">
		<div class="e-expansion-panel__header">
			<button :class="buttonClass" @click="changeValue(!opened)" :aria-expanded="opened"
				:aria-controls="expansionContentId" :id="expansionHeaderId" :disabled="props.disabled">
				<span class="e-expansion-panel__header-button-content">
					<slot name="header">
						{{ headerTitle }}
					</slot>
					<div class="e-expansion-panel__header-button-icon">
						<EIcon :icon="icon.arrowDown"></EIcon>
					</div>
				</span>
			</button>
			<div class="e-expansion-panel__header-actions">
				<slot name="actions"></slot>
			</div>
		</div>
		<div class="e-expansion-panel__body">
			<ETransitionExpand>
				<div v-show="opened" class="e-expansion-panel__body-content" :role="'region'" :aria-labelledby="expansionHeaderId"
					:id="expansionContentId">
					<div class="e-expansion-panel__body-content-wrapper">
						<slot name="default"></slot>
					</div>
				</div>
			</ETransitionExpand>
		</div>
	</div>
</template>
<script lang="ts" setup>
import icon from '@/utils/icons';
import { computed, ref, inject } from 'vue';
import ETransitionExpand from '@/components/transition/expand.vue';
import EIcon from '@/components/icon/index.vue';
import { ElevationProps } from '@/types';

export interface Props extends ElevationProps {
	dense?: boolean
	headerTitle?: string
	color?: string
	modelValue?: boolean
	id?: string
	disabled?: boolean
}

const localValue = ref(false);
const panelsElevation = inject<string | undefined>('expansionPanelsElevation', undefined);
const props = withDefaults(defineProps<Props>(), { modelValue: undefined })

// ID determinístico para accesibilidad
function sanitizeId(str: string) {
	return str.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
}
const baseId = computed(() => {
	if (props.id) return sanitizeId(props.id);
	if (props.headerTitle) return sanitizeId(props.headerTitle);
	return 'expansion';
});
const expansionHeaderId = computed(() => `${baseId.value}-header`);
const expansionContentId = computed(() => `${baseId.value}-content`);

// Elevation: usa la prop si está, si no, la de Panels, si no, 'sm'
const effectiveElevation = computed(() => props.elevation || panelsElevation || 'sm');

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
	(e: 'expand'): void
	(e: 'collapse'): void
	(e: 'toggle', value: boolean): void
}>()

const rootClasses = {
	dense: "e-expansion-panel--dense",
	opened: "e-expansion-panel--opened",
};

const opened = computed((): boolean => props.modelValue === undefined ? localValue.value : props.modelValue)

const expansionClass = computed(() => {
	const classes = ['e-expansion-panel']
	props.dense && classes.push(rootClasses.dense)
	opened.value && classes.push(rootClasses.opened)
	props.disabled && classes.push('e-expansion-panel--disabled')
	if (effectiveElevation.value) {
		classes.push(`e-elevation--${effectiveElevation.value}`)
	}
	return classes
})
const buttonClass = computed(() => {
	const classes = ['e-expansion-panel__header-button']
	props.color && classes.push(`${props.color}--text`)
	return classes
})

const changeValue = (value: boolean) => {
	if (props.disabled) return;
	const prev = opened.value;
	if (prev === value) return;

	if (props.modelValue === undefined) {
		localValue.value = value;
	} else {
		emit("update:modelValue", value);
	}

	emit('toggle', value);
	if (value) {
		emit('expand');
	} else {
		emit('collapse');
	}
}

</script>
<style lang="scss" src="./style.scss"></style>