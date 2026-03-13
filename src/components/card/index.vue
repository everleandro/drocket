<template>
    <div :class="cardClass" :style="cardStyle">
        <slot> </slot>
        <slot name="footer"> </slot>
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { ElevationProps } from '@/types';
import { getBooleanClasses } from '@/composables/utils';

export interface Props extends ElevationProps {
    height?: string
    color?: string
    depressed?: boolean
}
const props = defineProps<Props>()

const booleanClassKeys = ['depressed'] as const

const cardClass = computed(() => {
    const classes: string[] = ['e-card']

    classes.push(...getBooleanClasses(props, booleanClassKeys, 'e-card'))

    props.color && classes.push(`${props.color}--text`)
    props.elevation && classes.push(`e-elevation--${props.elevation}`)

    return classes
})

const cardStyle = computed((): Record<string, string> => {
    const result: Record<string, string> = {}
    props.height && (result.height = `${props.height}px`)
    return result;
})

</script>
<style lang="scss" src="./style.scss"></style>