<template>
    <div class="e-window">
        <div ref="container" class="e-window__container">
            <transition-group :name="transitionName">
                <slot></slot>
            </transition-group>
        </div>
    </div>
</template>
<script lang="ts" >
export default { name: 'EWindow' }
export interface EWindow {
    modelValue: ComputedRef<string | number | undefined>
}
</script>
<script lang="ts" setup>
import { ComputedRef, computed, provide, ref, watch } from 'vue';

export interface Props { modelValue?: string | number }
const transitionName = ref('tab-transition')
const container = ref()
// 'tab-reverse-transition' : 'tab-transition'
const inBrowser = (): boolean => typeof window !== 'undefined'

const props = defineProps<Props>()

watch(() => props.modelValue, (value) => {
    setTransitionName(value);
})

const emit = defineEmits<{ (e: 'update:modelValue', value: number | string): void }>()

const changeValue = (value: string | number): void => {
    emit('update:modelValue', value)
}

const setTransitionName = (value: string | number | undefined) => {
    if (value) {
        const el = container.value as HTMLDivElement
        const active = el.querySelectorAll('.e-window-item.e-window-item--active')[0]
        const to = el.querySelectorAll(`.e-window-item[data-value='${value}']`)[0]
        const nodeList = el.querySelectorAll('.e-window-item')
        const activeIndex = [...nodeList].indexOf(active)
        const toIndex = [...nodeList].indexOf(to)
        transitionName.value = toIndex > activeIndex ? 'tab-transition' : 'tab-reverse-transition'
    }
}

provide("EWindow", {
    changeValue,
    modelValue: computed(() => props.modelValue)
});
</script>
<style lang="scss" src="./style.scss"></style>