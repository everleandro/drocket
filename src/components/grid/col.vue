<template>
    <div :class="gridClass">
        <slot name="default"></slot>
    </div>
</template>
  
<script lang="ts" setup>

import { useGrid } from "@/composables/grid"
import { computed } from "vue"

export interface Props {
    cols?: string | number
    xs?: string | number
    sm?: string | number
    md?: string | number
    lg?: string | number
    xl?: string | number
}

const props = defineProps<Props>()
const { gridClass } = useGrid()
const columnClass = computed(() => [...gridClass.value, 'e-col'])

</script>
  