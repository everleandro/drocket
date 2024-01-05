<template>
  <div :class="gridClass">
    <slot name="default"></slot>
  </div>
</template>
  
<script lang="ts" setup>
import { computed } from 'vue';

export interface Props {
  noGutters?: boolean
}
const props = defineProps<Props>()
const gridClass = computed(() => {
  const result: Array<string> = ['e-row']
  props.noGutters && result.push('no-gutters')
  return result
})
</script>
<style lang="scss" src="./style.scss"></style>
  