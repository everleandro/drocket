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
import { useResolvedColor } from '@/composables/color';
import { normalizeCssSize } from '@/utils/style';

const mounted = ref(false);
export interface Props {
    indeterminate?: boolean
    height?: string | number
    color?: string
    value?: number
}
const props = withDefaults(defineProps<Props>(), { height: 4, color: 'primary', value: 0, indeterminate: false })
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

const { colorStyles } = useResolvedColor({
    color: computed(() => props.color),
    colorVar: '--e-progress-linear-color',
})

const determinateStyle = computed(() => ({ width: `${normalizedValue.value}%` }))
const ariaValueNow = computed(() => isIndeterminate.value ? undefined : String(normalizedValue.value))

onMounted(() => {
    mounted.value = true;
});
const progressStyle = computed(() => ({
    ...colorStyles.value,
    '--e-progress-linear-height': normalizeCssSize(props.height) || '4px',
}))
</script>
<style lang="scss" src="./style.scss"></style>