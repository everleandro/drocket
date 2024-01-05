<template>
    <ul role="list" :class="listCLass">
        <slot />
    </ul>
</template>
  
<script lang="ts" setup>
import { computed } from 'vue'

export type ListClassKeys = 'disabled' | 'depressed' | 'outlined'
export interface Props {
    disabled?: boolean
    depressed?: boolean
    outlined?: boolean
    dense?: boolean
    color?: string
}
const props = defineProps<Props>()
const availableRootClasses = {
    disabled: "e-list--disabled",
    depressed: "e-list--depressed",
    dense: "e-list--dense",
    outlined: "e-list--outlined",
};
const listCLass = computed((): Array<string> => {
    const classes = ['e-list']
    props.color && classes.push(`${props.color}--text`)

    const availableRootClassKeys = Object.keys(availableRootClasses) as Array<ListClassKeys>
    const classes2 = availableRootClassKeys.filter(
        (key) => !!props[key]
    ).map(key => availableRootClasses[key]);

    return [...classes, ...classes2];

})
</script>
<style lang="scss" src="./style.scss"></style>
  