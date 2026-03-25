<template>
    <header ref="el" :class="barClass" :style="mergedStyle" :data-layout="app" :data-clipped="clipped">
        <div class="e-bar__content">
            <slot></slot>
        </div>
        <div v-if="slots.append" class="e-bar__append">
            <slot name="append"></slot>
        </div>
    </header>
</template>
<script lang="ts" setup>
import { ComputedRef, Ref, computed, onMounted, onBeforeUnmount, onUnmounted, ref, watch, useSlots, nextTick } from 'vue'
import { BarProps } from '@/types'
import { useLayout, useResolvedColor } from '@/composables'

let el: Ref<HTMLHeadElement | null> = ref(null)
let resizeObserver: ResizeObserver | null = null
const slots = useSlots()
const props = defineProps<BarProps>()
const { setAppBarLayout, resetAppBarLayout, barLayoutStyle } = useLayout()

const booleanClassKeys = ['dense', 'fixed', 'clipped', 'depressed', 'app', 'absolute', 'outlined'] as const

const { colorStyles } = useResolvedColor({
    color: computed(() => props.color),
    colorVar: '--e-bar-bg',
    contrastVar: '--e-bar-color',
})

watch(() => [props.clipped, props.fixed, props.absolute, props.app, props.dense], () => {
    nextTick(() => {
        refreshLayoutStyle()
    })
});

onMounted(() => {
    refreshLayoutStyle()
    
    if (el.value) {
        resizeObserver = new ResizeObserver(() => {
            refreshLayoutStyle()
        })
        resizeObserver.observe(el.value)
    }
})

onBeforeUnmount(() => {
    if (resizeObserver && el.value) {
        resizeObserver.unobserve(el.value)
        resizeObserver.disconnect()
        resizeObserver = null
    }
})

onUnmounted(() => {
    resetAppBarLayout()
})

const barClass: ComputedRef<Array<string>> = computed((): Array<string> => {
    const classes = ['e-bar']

    booleanClassKeys.forEach((key) => {
        if (props[key]) {
            classes.push(`e-bar--${key}`)
        }
    })

    return classes
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
    const result: Record<string, string> = { ...colorStyles.value }

    if (props.height) {
        return {
            ...result,
            height: computedHeight.value
        }
    }

    return result;

})

const mergedStyle = computed((): Record<string, string> => ({
    ...barLayoutStyle.value,
    ...style.value,
}))

const refreshLayoutStyle = (): void => {
    if (!el.value) return
    
    const height = el.value.getBoundingClientRect().height
    setAppBarLayout({
        enabled: !!props.app,
        app: !!props.app,
        height,
        clipped: !!props.clipped,
        absolute: !!props.absolute,
        fixed: !!props.fixed,
    })
}

</script>
<style lang="scss" src="./style.scss"></style>
