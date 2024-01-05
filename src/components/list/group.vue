<template>
    <div role="listbox" :class="groupCLass">
        <slot></slot>
    </div>
</template>
  
<script lang="ts" setup>
export interface Props {
    disabled?: boolean
    color?: string
    itemValue?: string
    modelValue?: Record<string, any> | string | number
}
const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const groupCLass = (): Array<string> => {
    const classes = ["e-list-group"]
    props.color && classes.push(props.color)
    return classes
}
const changeValue = (value: boolean): void => {
    emit('update:modelValue', value)
}
</script>
  