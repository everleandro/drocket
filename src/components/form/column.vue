<template>
    <div :class="rootClass">
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
import { computed } from "vue"
import { useGridCol } from "@/composables/grid-col"
import type { ColProps } from "@/types"

const props = defineProps<ColProps>()

const { gridColClass } = useGridCol(props)

const rootClass = computed(() => [
    "e-form__child",
    ...gridColClass.value,
])
</script>