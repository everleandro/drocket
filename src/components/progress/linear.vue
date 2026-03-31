<template>
    <div v-if="mounted" :class="progressClass" role="progressbar" aria-hidden="false" aria-valuemin="0" aria-valuemax="100"
        :aria-valuenow="ariaValueNow" :style="progressStyle">
        <div class="e-progress-linear__background" style="width: 100%;"></div>
        <div v-if="isIndeterminate" class="e-progress-linear__indeterminate">
            <div class="e-progress-linear__indeterminate long"></div>
            <div class="e-progress-linear__indeterminate short"></div>
        </div>
        <div v-else class="e-progress-linear__determinate" :style="determinateStyle"></div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { normalizeCssSize, getColorContrastCssValue, getColorCssValue } from '@/utils/style';

const mounted = ref(false);
export interface Props {
    indeterminate?: boolean
    height?: string | number
    color?: string
    useContrastColor?: boolean
    value?: number
}
const props = withDefaults(defineProps<Props>(), { height: 4, value: 0, indeterminate: false })
const isIndeterminate = computed(() => Boolean(props.indeterminate))
const normalizedValue = computed(() => {
    const parsed = Number(props.value)

    if (Number.isNaN(parsed)) return 0

    return Math.min(100, Math.max(0, parsed))
})
const progressClass = computed(() => {
    const classes = ['e-progress-linear']

    isIndeterminate.value && classes.push('e-progress-linear--active')

    return classes
})

const resolvedProgressColor = computed(() => {
    if (!props.color) return undefined

    return props.useContrastColor
        ? getColorContrastCssValue(props.color)
        : getColorCssValue(props.color)
})

const determinateStyle = computed(() => ({ width: `${normalizedValue.value}%` }))
const ariaValueNow = computed(() => isIndeterminate.value ? undefined : String(normalizedValue.value))

onMounted(() => {
    mounted.value = true;
});
const progressStyle = computed(() => {
    const result: Record<string, string> = {
        '--e-progress-linear-height': normalizeCssSize(props.height) || '4px',
    }

    if (resolvedProgressColor.value) {
        result['--e-progress-linear-color'] = resolvedProgressColor.value
    }

    return result
})
</script>
<style lang="scss" src="./style.scss"></style>