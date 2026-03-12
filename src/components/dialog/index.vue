
<template>
    <Teleport to="body">
        <transition v-if="mounted" name="fade">
            <div v-show="store.active" role="dialog" aria-modal="true" :class="contentClass" :style="contentStyle" tabindex="0">
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

export interface EDIalog {
    close: (forece?: boolean) => void
}
export interface Props extends ElevationProps {
    fullscreen?: boolean
    modelValue?: boolean
    absolute?: boolean
    persistent?: boolean
    maxWidth?: string | number
}
const mounted = ref(false);
const overlayId = `dialog-overlay-${Math.random().toString(36).slice(2)}`;
const { openOverlay, closeOverlay, getStackZIndex } = useOverlayService();

const availableRootClasses = {
    fullscreen: "e-dialog--fullscreen",
    animated: "e-dialog--animated",
    absolute: "e-dialog__content--absolute",
    active: "e-dialog--active",
    persistent: "e-dialog--persistant",
};

const props = defineProps<Props>()
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
            dismissible: true,
            lockScroll: true,
            onOutsideClick: () => close(),
            onEscape: () => close(),
        })
    } else {
        closeOverlay(overlayId)
    }

    store.active = nextValue
}, { immediate: true })


const dialogClass = computed(() => {
    const classes = ['e-dialog']
    props.fullscreen && classes.push(availableRootClasses.fullscreen)
    store.active && classes.push(availableRootClasses.active)
    props.absolute && classes.push(availableRootClasses.absolute)
    store.animated && classes.push(availableRootClasses.animated)
    props.elevation && classes.push(`e-elevation--${props.elevation}`)
    return classes
})


const contentClass = computed(() => {
    const classes = ['e-dialog__content']
    props.absolute && classes.push(availableRootClasses.absolute)
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