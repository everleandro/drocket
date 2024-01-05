
<template>
    <transition name="fade">
        <div v-show="store.active" role="dialog" aria-modal="true" :class="contentClass" tabindex="0" @click.self="close()">
            <transition name="scale">
                <div v-show="store.active" :class="dialogClass" :style="style">
                    <slot></slot>
                </div>
            </transition>
        </div>
    </transition>
</template>
<script lang="ts">
export default { name: 'EDialog' }
</script>
<script lang="ts" setup>
import { computed, onMounted, provide, reactive, watch } from 'vue'


export interface Props {
    fullscreen?: boolean
    modelValue?: boolean
    absolute?: boolean
    persistent?: boolean
    maxWidth?: string | number
}
export interface EDIalog {
    close: (forece?: boolean) => void
}

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
    if (value) {
        document.addEventListener("keydown", handleExcListener);
    } else {
        document.removeEventListener("keydown", handleExcListener);
    }
    store.active = value
})


const dialogClass = computed(() => {
    const classes = ['e-dialog']
    props.fullscreen && classes.push(availableRootClasses.fullscreen)
    store.active && classes.push(availableRootClasses.active)
    props.absolute && classes.push(availableRootClasses.absolute)
    store.animated && classes.push(availableRootClasses.animated)
    return classes
})


const contentClass = computed(() => {
    const classes = ['e-dialog__content']
    props.absolute && classes.push(availableRootClasses.absolute)
    return classes
})


onMounted(() => store.active = props.modelValue)


const handleExcListener = ({ key }: KeyboardEvent): void => {
    if (key === "Escape") {
        close();
    }
}
const changeValue = (value: boolean) => {
    emit('update:modelValue', value)
}

const style = computed((): { maxWidth?: string } => {
    const maxWidth =
        props.maxWidth && !props.fullscreen
            ? { maxWidth: `${props.maxWidth}px` }
            : {};
    return { ...maxWidth };
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