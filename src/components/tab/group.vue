<template>
    <div :class="tabGroupCLass" tabindex="-1" role="tablist">
        <div class="e-slide-group__container">
            <div class="e-slide-group__content" style="transform: translateY(0px);">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script lang="ts" >
export default { name: 'tabGroup' }
export interface TabGroup {
    changeValue: (value: number | string) => void
    modelValue: ComputedRef<string | number | undefined>
    color: ComputedRef<string>
    inactiveColor: ComputedRef<string>
}
</script>
<script lang="ts" setup>
import { ComputedRef, computed, provide } from 'vue';

export interface Props { modelValue?: string | number, color?: string, inactiveColor?: 'secondary', direction?: string, tabAlign?: string }
const props = withDefaults(defineProps<Props>(), { color: 'primary', inactiveColor: 'secondary', tabAlign: 'center', direction: 'horizontal' })
const emit = defineEmits<{ (e: 'update:modelValue', value: number | string): void }>()

const changeValue = (value: string | number): void => emit('update:modelValue', value)
const tabGroupCLass = computed(() => {
    const classes = ['e-slide-group e-tabs e-tabs--density-default']
    if (props.direction === 'vertical') classes.push('e-slide-group--vertical e-tabs--vertical')
    classes.push(`e-tabs--align-tabs-${props.tabAlign}`)
    return classes;
})
provide("TabGroup", {
    changeValue,
    modelValue: computed(() => props.modelValue),
    color: computed(() => props.color),
    inactiveColor: computed(() => props.inactiveColor)
});

</script>