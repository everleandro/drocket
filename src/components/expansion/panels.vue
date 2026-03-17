<template>
	<div :class="panelsClass">
		<slot name="default"></slot>
	</div>
</template>

<script lang="ts" setup>
import { ElevationProps } from '@/types';
import { provide } from 'vue';

const props = withDefaults(defineProps<ElevationProps & { accordion?: boolean }>(), {
	elevation: 'sm',
	accordion: false,
});

provide('expansionPanelsElevation', props.elevation);

const panelsClass = [
	'e-expansion-panels',
	props.accordion ? 'e-expansion-panels--accordion' : '',
];
</script>