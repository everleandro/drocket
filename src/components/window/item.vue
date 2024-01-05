<template>
    <div v-show="active" :class="['e-window-item', { 'e-window-item--active': active }]" disabled="false" :key="value"
        :data-value="value">
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
import { computed, inject } from "vue";
import { EWindow } from "./index.vue"

export interface Props {
    value: string | number
}
const props = defineProps<Props>()
const Group = inject<Partial<EWindow> | undefined>("EWindow", undefined);

const active = computed(() => Group?.modelValue?.value === props.value)
</script>