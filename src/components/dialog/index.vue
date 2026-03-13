
<template>
    <Teleport to="body">
        <transition v-if="mounted" name="fade">
            <div ref="dialogContent" v-show="store.active" role="dialog" aria-modal="true" :class="contentClass" :style="contentStyle" tabindex="0">
                <transition name="scale">
                    <div v-show="store.active" :class="dialogClass" :style="dialogStyle">
                        <slot></slot>
                    </div>
                </transition>
            </div>
        </transition>
    </Teleport>
</template>
<script lang="ts">
export default { name: 'EDialog' }
</script>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, provide, reactive, watch, ref } from 'vue'
import { ElevationProps } from '@/types'
import { useOverlayService } from '@/composables'
import { getBooleanClasses } from '@/composables/utils'

export interface EDIalog {
    close: (forece?: boolean) => void
}
export interface Props extends ElevationProps {
    fullscreen?: boolean
    modelValue?: boolean
    absolute?: boolean
    autoFocus?: boolean
    restoreFocus?: boolean
    persistent?: boolean
    maxWidth?: string | number
}
const mounted = ref(false);
const overlayId = `dialog-overlay-${Math.random().toString(36).slice(2)}`;
const { openOverlay, closeOverlay, getStackZIndex, updateOverlayContentElement } = useOverlayService();

const dialogPropsBooleanClassKeys = [
    'fullscreen',
    'persistent',
] as const

const contentBooleanClassKeys = ['absolute'] as const

const props = withDefaults(defineProps<Props>(), {
    autoFocus: true,
    restoreFocus: true,
})
const dialogContent = ref<HTMLElement | null>(null)
const store = reactive({
    animated: false,
    active: false
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

watch(() => props.modelValue, (value) => {
    const nextValue = !!value

    if (nextValue) {
        openOverlay({
            id: overlayId,
            dismissible: !props.persistent,
            lockScroll: true,
            autoFocus: props.autoFocus,
            restoreFocus: props.restoreFocus,
            contentElement: dialogContent.value,
            onOutsideClick: () => close(),
            onEscape: () => close(),
        })
    } else {
        closeOverlay(overlayId)
    }

    store.active = nextValue
}, { immediate: true })

watch(() => [mounted.value, store.active, dialogContent.value] as const, ([isMounted, isActive, contentElement]) => {
    if (!isMounted || !isActive || !contentElement) {
        return
    }

    updateOverlayContentElement(overlayId, contentElement)
}, { flush: 'post' })


const dialogClass = computed(() => {
    const classes: string[] = ['e-dialog']

    classes.push(...getBooleanClasses(props, dialogPropsBooleanClassKeys, 'e-dialog'))

    if (store.animated) {
        classes.push('e-dialog--animated')
    }

    if (store.active) {
        classes.push('e-dialog--active')
    }

    props.elevation && classes.push(`e-elevation--${props.elevation}`)

    return classes
})


const contentClass = computed(() => {
    const classes: string[] = ['e-dialog__content']

    classes.push(...getBooleanClasses(props, contentBooleanClassKeys, 'e-dialog__content'))

    return classes
})

const contentStyle = computed((): { zIndex?: string } => {
    const zIndex = getStackZIndex(overlayId, 1)
    return zIndex === null ? {} : { zIndex: `${zIndex}` }
})


onMounted(() => { mounted.value = true })

onUnmounted(() => {
    closeOverlay(overlayId)
})

const changeValue = (value: boolean) => {
    emit('update:modelValue', value)
}

const dialogStyle = computed((): { maxWidth?: string; zIndex?: string } => {
    const dialogZIndex = getStackZIndex(overlayId, 2)
    const maxWidth =
        props.maxWidth && !props.fullscreen
            ? { maxWidth: `${props.maxWidth}px` }
            : {};
    const zIndex = dialogZIndex === null ? {} : { zIndex: `${dialogZIndex}` }
    return { ...maxWidth, ...zIndex };
})

const close = (force = false): void => {
    if (!force && props.persistent) {
        store.animated = true;
        setTimeout((): void => {
            store.animated = false;
        }, 200);
    } else {
        changeValue(false)
    }
}

provide("EDialog", {
    close
});
defineExpose({ close })
</script>
<style lang="scss" src="./style.scss"></style>