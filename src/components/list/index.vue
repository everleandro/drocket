<template>
    <ul role="list" :class="listCLass">
        <slot />
    </ul>
</template>
  
<script lang="ts" setup>
import { computed } from 'vue'
import { provide, defineProps, defineEmits } from 'vue';
import { ListModelProp } from '@/types'

export interface Props {
    disabled?: boolean
    elevated?: boolean
    outlined?: boolean
    dense?: boolean
    color?: string
    group?: ListModelProp,
    modelValue?: ListModelProp
}
const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: ListModelProp): void
    (e: 'update:group', value: ListModelProp): void
}>()

const booleanClassKeys = ['disabled', 'elevated', 'dense', 'outlined'] as const

const listCLass = computed((): Array<string> => {
    const classes = ['e-list']
    props.color && classes.push(`${props.color}--text`)

    booleanClassKeys.forEach((key) => {
        if (props[key]) {
            classes.push(`e-list--${key}`)
        }
    })

    return classes;

})

const changeModelValue = (value: ListModelProp): void => {
    let result = value
    if (Array.isArray(props.modelValue)) { // multiple
        if (props.modelValue.includes(value as string | number)) {
            result = props.modelValue.filter((v) => v !== value)
        } else {
            result = [...props.modelValue, value as string | number]
        }

    } else {
        result = value === props.modelValue ? undefined : value
    }
    emit('update:modelValue', result)
}

const changeGroupValue = (value: ListModelProp): void => {
    let result = value
    if (Array.isArray(props.group)) { // multiple
        if (props.group.includes(value as string | number)) {
            result = props.group.filter((v) => v !== value)
        } else {
            result = [...props.group, value as string | number]
        }

    } else {
        result = value === props.group ? undefined : value
    }
    emit('update:group', result)
}

provide("EList", { changeModelValue, changeGroupValue, modelValue: computed(() => props.modelValue), group: computed(() => props.group) });

</script>
<style lang="scss" src="./style.scss"></style>
  