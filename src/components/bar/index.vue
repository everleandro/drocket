<template>
    <header ref="el" :class="barClass" :style="style" :data-layout="app" :data-clipped="clipped">
        <div class="e-bar__content">
            <slot></slot>
        </div>
    </header>
</template>
<script lang="ts" setup>
import { ComputedRef, Ref, computed, onMounted, ref, watch } from 'vue'
import { BarProps, BarClassKeys } from '@/types'
let el: Ref<HTMLHeadElement | null> = ref(null)

const props = defineProps<BarProps>()

const availableRootClasses = {
    dense: 'e-bar--dense',
    fixed: 'e-bar--fixed',
    clipped: 'e-bar--clipped',
    depressed: 'e-bar--depressed',
    app: 'e-bar--app',
    outlined: 'outlined'
};

watch(() => props.clipped, () => {
    refreshLayoutStyle();
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

const style = computed((): Record<string, string> => {
    return props.height ? { height: `${props.height}px !important;` } : {};

})

const refreshLayoutStyle = (): void => {
    if (props.app) {
        const height = el.value && el.value.getBoundingClientRect().height || 0
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
  