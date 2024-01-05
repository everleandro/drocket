<template>
    <form ref="form" :class="formClass" v-on:submit="submit">
        <slot></slot>
    </form>
</template>
<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, provide, reactive, ref, watch } from 'vue'
export default defineComponent({
    name: "EForm"
})
</script>
  
<script lang="ts" setup>
import { Field } from '@/types';

export interface Props {
    modelValue?: boolean | undefined
    lazy?: boolean
    noGutters?: boolean
    outlined?: boolean
    disabled?: boolean
    readonly?: boolean
    retainColor?: boolean
    labelMinWidth?: string
    color?: string
}

const props = withDefaults(defineProps<Props>(), { modelValue: undefined })
const localValue = ref(true)
const form = ref()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'submit', value: SubmitEvent): void
}>()

const state = reactive({
    fieldsChild: new Array<Partial<Field>>(),
    fieldsChildError: new Array<boolean>(),
    localValue: true
});

const formClass = computed(() => {
    const result: Array<string> = ['e-form']
    props.noGutters && result.push('no-gutters')
    props.outlined && result.push('e-form--outlined')
    props.disabled && result.push('e-form--disabled')
    props.readonly && result.push('e-form--readonly')
    return result
})

watch(() => state.fieldsChildError, (val: Array<boolean>) => {
    const valid = !val.find((e) => !!e)
    changeValue(valid)
}, { deep: true })

onMounted(() => {
    setConfiguration()
})
const submit = (event: Event): void => {
    event.preventDefault()
    emit('submit', event as SubmitEvent)
}

const bindField = (component: Field) => {
    state.fieldsChild.push(component);
    state.fieldsChildError.push(false);
}

const unbindField = (uid: number) => {
    const index = state.fieldsChild.findIndex((c) => c.uid === uid);
    if (index > -1) {
        state.fieldsChild.splice(index, 1);
        state.fieldsChildError.splice(index, 1);
    }
}

const updateField = (component: Field) => {
    const index = state.fieldsChild.findIndex((c) => c.uid === component.uid);
    if (index > -1) {
        state.fieldsChildError.splice(index, 1, component.hasError)
    }
}

provide("EForm", {
    bindField,
    unbindField,
    updateField
});

const changeValue = (value: boolean): void => {
    localValue.value = value;
    emit('update:modelValue', value)
}

const reset = (): void => {
    state.fieldsChild.forEach((vueComponent) => {
        vueComponent.reset?.();
    });
}

watch(() => props.color, () => setConfiguration())
watch(() => props.retainColor, () => setConfiguration())

const setConfiguration = (): void => {
    state.fieldsChild.forEach((vueComponent) => {
        const configuration: Record<string, any> = {}
        props.labelMinWidth && (configuration.labelStyle = { minWidth: `${props.labelMinWidth}px` })
        props.color && (configuration.color = props.color)
        props.retainColor && (configuration.retainColor = props.retainColor)
        vueComponent.setConfiguration?.(configuration);
    });
}

const validate = async (): Promise<boolean> => {
    let valid = true;
    state.fieldsChild.forEach((vueComponent) => {
        if (!vueComponent.validate?.()) {
            //form is not valid if almost one field is invalid 
            valid = false
        }
    });
    await nextTick()
    return valid
}

defineExpose({ validate, reset })

</script>
<style lang="scss" src="./style.scss"></style>