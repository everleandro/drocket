<template>
    <div :class="cardClass" :style="cardStyle">
        <slot> </slot>
        <slot name="footer"> </slot>
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { ElevationProps } from '@/types';
import { useResolvedColor } from '@/composables/color';
import { getBooleanClasses, normalizeDimension } from '@/composables/utils';

export interface Props extends ElevationProps {
    height?: string
    color?: string
    outlined?: boolean
    depressed?: boolean
}
const props = defineProps<Props>()

const booleanClassKeys = ['outlined', 'depressed'] as const

const { colorStyles } = useResolvedColor({
    color: computed(() => props.color),
    colorVar: '--card-bg',
    contrastVar: '--card-text',
})

const cardClass = computed(() => {
    const classes: string[] = ['e-card']

    classes.push(...getBooleanClasses(props, booleanClassKeys, 'e-card'))

    props.elevation && classes.push(`e-elevation--${props.elevation}`)

    return classes
})

const cardStyle = computed((): Record<string, string> => {
    const result: Record<string, string> = { ...colorStyles.value }
    const height = normalizeDimension(props.height)

    if (height) {
        result.height = height
    }

    return result;
})

</script>
<style lang="scss" src="./style.scss"></style>