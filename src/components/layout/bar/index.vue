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
import { useLayout } from '@/composables'

let el: Ref<HTMLHeadElement | null> = ref(null)
let resizeObserver: ResizeObserver | null = null
const slots = useSlots()
const props = defineProps<BarProps>()
const { setLayoutConfig, barLayoutStyle } = useLayout()

const booleanClassKeys = ['dense', 'fixed', 'clipped', 'depressed', 'app', 'absolute', 'outlined'] as const

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
    setLayoutConfig({ appBar: { enabled: false } })
})

const barClass: ComputedRef<Array<string>> = computed((): Array<string> => {
    const classes = ['e-bar']
    props.color && classes.push(props.color)

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
    if (props.height) {
        return {
            height: computedHeight.value
        }
    }
    return {};

})

const mergedStyle = computed((): Record<string, string> => ({
    ...barLayoutStyle,
    ...style.value,
}))

const refreshLayoutStyle = (): void => {
    if (!el.value) return
    
    const height = el.value.getBoundingClientRect().height
    setLayoutConfig({
        appBar: {
            enabled: !!props.app,
            height,
            clipped: !!props.clipped
        }
    })
}

</script>
<style lang="scss" src="./style.scss"></style>
