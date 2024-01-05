<template>
    <div :class="progressClass" role="progressbar" aria-hidden="false" aria-valuemin="0" aria-valuemax="100"
        :style="progressStyle">
        <div class="e-progress-linear__background" style="width: 100%;"></div>
        <div class="e-progress-linear__indeterminate">
            <div class="e-progress-linear__indeterminate long"></div>
            <div class="e-progress-linear__indeterminate short"></div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

export interface Props {
    indeterminate?: boolean
    height?: string | number
    color?: string
}
const props = withDefaults(defineProps<Props>(), { height: 4, color: 'primary' })
const progressClass = computed(() => {
    const classes = ['e-progress-linear e-progress-linear--active']
    classes.push(`${props.color}--text`)
    return classes
})
const progressStyle = computed(() => ({ '--e-progress-linear-height': `${props.height}px` }))
</script>
<style lang="scss" src="./style.scss"></style>