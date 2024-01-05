<template>
    <div :class="componentClass">
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
import { useGrid } from "@/composables/grid"
import { computed } from "vue";

const props = defineProps<{
    cols?: string | number; xs?: string | number; sm?: string | number;
    md?: string | number; lg?: string | number; xl?: string | number;
}>()
const { gridClass } = useGrid('e-field')

const componentClass = computed(() => gridClass.value)
</script>