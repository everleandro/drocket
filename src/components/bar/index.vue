<template>
    <header ref="el" :class="barClass" :style="style" :data-layout="app" :data-clipped="clipped">
        <div class="e-bar__content">
            <slot></slot>
        </div>
        <div v-if="slots.append" class="e-bar__append">
            <slot name="append"></slot>
        </div>
    </header>
</template>
<script lang="ts" setup>
import { ComputedRef, Ref, computed, onMounted, ref, watch, useSlots, nextTick } from 'vue'
import { BarProps, BarClassKeys } from '@/types'

let el: Ref<HTMLHeadElement | null> = ref(null)
const slots = useSlots()
const props = defineProps<BarProps>()

const availableRootClasses = {
    dense: 'e-bar--dense',
    fixed: 'e-bar--fixed',
    clipped: 'e-bar--clipped',
    depressed: 'e-bar--depressed',
    app: 'e-bar--app',
    absolute: 'e-bar--absolute',
    outlined: 'e-bar--outlined'
};

watch(() => [props.clipped, props.fixed, props.absoulute, props.app], () => {
    refreshLayoutStyle()
});

watch(() => props.dense, () => {
    nextTick(() => {
        refreshLayoutStyle(props.dense ? 48 : 64)
    })
});

onMounted(() => {
    refreshLayoutStyle()
})

const barClass: ComputedRef<Array<string>> = computed((): Array<string> => {
    const classes = ['e-bar']
    props.color && classes.push(props.color)

    const availableRootClassKeys = Object.keys(availableRootClasses) as Array<BarClassKeys>
    const classes2 = availableRootClassKeys.filter(
        (key) => !!props[key]
    ).map(key => availableRootClasses[key]);

    return [...classes, ...classes2]
})
const computedHeight = computed(() => {
    if (typeof props.height === 'number') {
        return `${props.height}px`
    } else if (typeof props.height === 'string' && props.height.length === parseInt(props.height, 10).toString().length) {
        return `${props.height}px`
    }
    return props.dense ? '48px' : '64px'
})

const style = computed((): Record<string, string> => {
    if (props.height) {
        return {
            height: computedHeight.value
        }
    }
    return {};

})

const refreshLayoutStyle = (_height?: number): void => {
    if (props.app) {
        const height = _height || el.value && el.value.getBoundingClientRect().height || 0
        const eMainNode = document.querySelector('.e-main[data-layout="true"]') as HTMLElement
        const eDrawerNode = document.querySelector('.e-drawer[data-layout="true"]') as HTMLElement

        if (eMainNode) {
            eMainNode.style.paddingTop = `${height}px`
        }

        if (eDrawerNode) {
            eDrawerNode.style.paddingTop = props.clipped ? `${height}px` : '0'
        }
    }
}

</script>
<style lang="scss" src="./style.scss"></style>
  