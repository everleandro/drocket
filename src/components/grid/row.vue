<template>
  <div :class="gridRowClass" :style="gridRowStyle">
    <slot name="default"></slot>
  </div>
</template>

<script lang="ts" setup>
import { useGridRow } from "@/composables/grid-row"
import type { RowProps } from "@/types"
const props = defineProps<RowProps>()
const { gridRowClass, gridRowStyle } = useGridRow(props);

</script>
<style lang="scss" src="./style.scss"></style>