<template>
    <div :class="componentClass">
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
import { useGridCol } from "@/composables/grid-col"
import { computed } from "vue";

const props = defineProps<{
    cols?: string | number; xs?: string | number; sm?: string | number;
    md?: string | number; lg?: string | number; xl?: string | number;
}>()
const { gridColClass } = useGridCol(props, 'e-field')

const componentClass = computed(() => gridColClass.value)
</script>