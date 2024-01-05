<template>
    <div :class="cardClass" :style="cardStyle">
        <slot> </slot>
        <slot name="footer"> </slot>
    </div>
</template>
<script lang="ts" setup>
import { computed, defineProps } from 'vue';

export interface Props {
    height?: string
    color?: string
    depressed?: boolean
}
const props = defineProps<Props>()

const cardClass = computed(() => {
    const classes = ['e-card']
    props.depressed && classes.push('e-card--depressed')
    props.color && classes.push(`${props.color}--text`)
    return classes
})

const cardStyle = computed((): Record<string, string> => {
    const result: Record<string, string> = {}
    props.height && (result.height = `${props.height}px`)
    return result;
})

</script>
<style lang="scss" src="./style.scss"></style>