
<template>
    <Teleport to="body">
        <transition v-if="mounted" name="fade">
            <div ref="dialogContent" v-show="store.active" role="dialog" aria-modal="true" :class="contentClass" :style="contentStyle" tabindex="0" @keydown="handleContentKeydown">
                <transition name="scale">
                    <div ref="dialogPanel" v-show="store.active" :class="dialogClass" :style="dialogStyle">
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
import { getBooleanClasses, normalizeDimension } from '@/composables/utils'

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
].join(',')
const mounted = ref(false);
const overlayId = `dialog-overlay-${Math.random().toString(36).slice(2)}`;
const { openOverlay, closeOverlay, getStackZIndex, updateOverlayContentElement } = useOverlayService();

const dialogPropsBooleanClassKeys = [
    'fullscreen',
    'persistent',
] as const

const contentBooleanClassKeys = ['absolute'] as const

const props = withDefaults(defineProps<ElevationProps & {
    fullscreen?: boolean
    modelValue?: boolean
    absolute?: boolean
    autoFocus?: boolean
    restoreFocus?: boolean
    persistent?: boolean
    maxWidth?: string | number
}>(), {
    autoFocus: true,
    restoreFocus: true,
})
const dialogContent = ref<HTMLElement | null>(null)
const dialogPanel = ref<HTMLElement | null>(null)
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
    const normalizedMaxWidth = normalizeDimension(props.maxWidth)
    const maxWidth = normalizedMaxWidth && !props.fullscreen
        ? { maxWidth: normalizedMaxWidth }
        : {}
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

const getFocusableElements = (): HTMLElement[] => {
    const root = dialogPanel.value || dialogContent.value
    if (!root) return []

    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
        if (!element.isConnected) return false
        if (element.getAttribute('aria-hidden') === 'true') return false
        if ((element as HTMLButtonElement).disabled) return false
        if (element.tabIndex < 0) return false
        if (element.hasAttribute('hidden')) return false
        return element.getClientRects().length > 0
    })
}

const handleContentKeydown = (evt: KeyboardEvent): void => {
    if (!store.active || evt.key !== 'Tab') return

    const container = dialogContent.value
    if (!container) return

    const focusableElements = getFocusableElements()

    if (!focusableElements.length) {
        evt.preventDefault()
        container.focus()
        return
    }

    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]
    const activeElement = document.activeElement as HTMLElement | null
    const isContainerFocused = activeElement === container
    const focusInsideDialog = !!activeElement && container.contains(activeElement)

    if (!focusInsideDialog) {
        evt.preventDefault()
        ;(evt.shiftKey ? lastFocusable : firstFocusable).focus()
        return
    }

    if (!evt.shiftKey && (isContainerFocused || activeElement === lastFocusable)) {
        evt.preventDefault()
        firstFocusable.focus()
        return
    }

    if (evt.shiftKey && (isContainerFocused || activeElement === firstFocusable)) {
        evt.preventDefault()
        lastFocusable.focus()
    }
}

provide("EDialog", {
    close
});
defineExpose({ close })
</script>
<style lang="scss" src="./style.scss"></style>